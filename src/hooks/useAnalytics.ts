import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    analytics.trackPageView(location.pathname, {
      search: location.search,
      hash: location.hash
    });
  }, [location]);

  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackConversationStart: analytics.trackConversationStart.bind(analytics),
    trackLessonComplete: analytics.trackLessonComplete.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    newSession: analytics.newSession.bind(analytics),
    getCurrentSessionId: analytics.getCurrentSessionId.bind(analytics)
  };
};