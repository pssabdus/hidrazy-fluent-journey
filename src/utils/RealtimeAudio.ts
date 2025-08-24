import { supabase } from '@/integrations/supabase/client';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      console.log('[AudioRecorder] Starting audio recording...');
      
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log('[AudioRecorder] Audio recording started successfully');
    } catch (error) {
      console.error('[AudioRecorder] Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    console.log('[AudioRecorder] Stopping audio recording...');
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

const createWavFromPCM = (pcmData: Uint8Array) => {
  // Convert bytes to 16-bit samples
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  // Create WAV header
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // WAV header parameters
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Data.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.byteLength, true);

  // Combine header and data
  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('[AudioQueue] Error playing audio:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }
}

let audioQueueInstance: AudioQueue | null = null;

export const playAudioData = async (audioContext: AudioContext, audioData: Uint8Array) => {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueue(audioContext);
  }
  await audioQueueInstance.addToQueue(audioData);
};

export class RealtimeChat {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private recorder: AudioRecorder | null = null;
  private sessionId: string | null = null;
  private isSessionCreated = false;

  constructor(
    private onMessage: (message: any) => void,
    private onConnectionStateChange: (connected: boolean) => void,
    private onSpeakingStateChange: (speaking: boolean) => void
  ) {}

  async init(conversationType = 'free_chat', userLevel = 'beginner') {
    try {
      console.log('[RealtimeChat] Initializing...');
      
      // Create session first
      const { data: sessionData } = await supabase.functions.invoke('openai-realtime-session', {
        body: { 
          conversationType,
          userLevel,
          culturalContext: 'arabic_speaker'
        }
      });

      if (!sessionData?.client_secret?.value) {
        throw new Error('Failed to get session token');
      }

      const token = sessionData.client_secret.value;
      this.sessionId = sessionData.id;
      console.log('[RealtimeChat] Session created:', this.sessionId);

      // Initialize audio context
      this.audioContext = new AudioContext();
      console.log('[RealtimeChat] Audio context initialized');

      // Connect to OpenAI Realtime API
      const wsUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`;
      this.ws = new WebSocket(wsUrl, ['realtime', `Bearer.${token}`]);

      this.ws.onopen = () => {
        console.log('[RealtimeChat] WebSocket connected');
        this.onConnectionStateChange(true);
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('[RealtimeChat] Received:', message.type, message);
        this.handleMessage(message);
      };

      this.ws.onclose = () => {
        console.log('[RealtimeChat] WebSocket disconnected');
        this.onConnectionStateChange(false);
      };

      this.ws.onerror = (error) => {
        console.error('[RealtimeChat] WebSocket error:', error);
        this.onConnectionStateChange(false);
      };

      // Start audio recording
      this.recorder = new AudioRecorder((audioData) => {
        if (this.ws?.readyState === WebSocket.OPEN && this.isSessionCreated) {
          const encodedAudio = encodeAudioForAPI(audioData);
          this.sendMessage({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          });
        }
      });

      await this.recorder.start();
      console.log('[RealtimeChat] Initialization complete');

    } catch (error) {
      console.error('[RealtimeChat] Initialization error:', error);
      throw error;
    }
  }

  private async handleMessage(message: any) {
    switch (message.type) {
      case 'session.created':
        console.log('[RealtimeChat] Session created, sending configuration...');
        this.isSessionCreated = true;
        this.sendSessionUpdate();
        break;

      case 'session.updated':
        console.log('[RealtimeChat] Session configured successfully');
        break;

      case 'response.audio.delta':
        if (this.audioContext) {
          const binaryString = atob(message.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await playAudioData(this.audioContext, bytes);
        }
        break;

      case 'response.audio_transcript.delta':
        this.onMessage({
          type: 'transcript_delta',
          content: message.delta,
          speaker: 'razia'
        });
        break;

      case 'response.created':
        this.onSpeakingStateChange(true);
        break;

      case 'response.done':
        this.onSpeakingStateChange(false);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        this.onMessage({
          type: 'transcript_complete',
          content: message.transcript,
          speaker: 'user'
        });
        break;

      case 'error':
        console.error('[RealtimeChat] Error from OpenAI:', message.error);
        break;

      default:
        console.log('[RealtimeChat] Unhandled message type:', message.type);
    }
  }

  private sendSessionUpdate() {
    this.sendMessage({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1000
        },
        temperature: 0.8,
        max_response_output_tokens: 'inf'
      }
    });
  }

  private sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  async sendText(text: string) {
    if (!this.isSessionCreated) {
      console.warn('[RealtimeChat] Session not ready for text input');
      return;
    }

    console.log('[RealtimeChat] Sending text:', text);
    
    this.sendMessage({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    });
    
    this.sendMessage({ type: 'response.create' });
  }

  disconnect() {
    console.log('[RealtimeChat] Disconnecting...');
    
    this.recorder?.stop();
    this.ws?.close();
    this.audioContext?.close();
    
    this.recorder = null;
    this.ws = null;
    this.audioContext = null;
    this.isSessionCreated = false;
    
    this.onConnectionStateChange(false);
  }
}