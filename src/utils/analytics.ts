import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  session_id?: string;
}

class AnalyticsManager {
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeUser();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      this.userId = session?.user?.id || null;
    } catch (error) {
      console.error('Failed to get user session:', error);
    }
  }

  async trackEvent(event: AnalyticsEvent) {
    try {
      // Update user ID if not set
      if (!this.userId) {
        const { data: { session } } = await supabase.auth.getSession();
        this.userId = session?.user?.id || null;
      }

      const eventData = {
        user_id: this.userId,
        event_type: event.event_type,
        event_data: event.event_data || {},
        session_id: event.session_id || this.sessionId,
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(eventData);

      if (error) {
        console.error('Failed to track analytics event:', error);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Convenience methods for common events
  async trackPageView(page: string, metadata?: Record<string, any>) {
    return this.trackEvent({
      event_type: 'page_view',
      event_data: {
        page,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }

  async trackConversationStart(conversationType: string, metadata?: Record<string, any>) {
    return this.trackEvent({
      event_type: 'conversation_start',
      event_data: {
        conversation_type: conversationType,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }

  async trackLessonComplete(lessonId: string, score?: number, timeSpent?: number) {
    return this.trackEvent({
      event_type: 'lesson_complete',
      event_data: {
        lesson_id: lessonId,
        score,
        time_spent_seconds: timeSpent,
        timestamp: new Date().toISOString()
      }
    });
  }

  async trackFeatureUsage(feature: string, metadata?: Record<string, any>) {
    return this.trackEvent({
      event_type: 'feature_usage',
      event_data: {
        feature,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }

  async trackError(errorType: string, errorMessage: string, metadata?: Record<string, any>) {
    return this.trackEvent({
      event_type: 'error',
      event_data: {
        error_type: errorType,
        error_message: errorMessage,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }

  // Get new session ID for new sessions
  newSession(): string {
    this.sessionId = this.generateSessionId();
    return this.sessionId;
  }

  getCurrentSessionId(): string {
    return this.sessionId;
  }
}

// Export singleton instance
export const analytics = new AnalyticsManager();

// Export convenience function for quick tracking
export const trackEvent = (event: AnalyticsEvent) => analytics.trackEvent(event);