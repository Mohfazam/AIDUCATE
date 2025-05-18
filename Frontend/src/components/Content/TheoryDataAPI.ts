import axios from 'axios';
import type { TheoryContent } from './theory';

interface SummarySubPoint {
  timestamp: string;
  title: string;
  subtitle: string;
  summary: string;
  tips: string[];
}

// @ts-ignore
interface SummaryMain {
  title: string;
  duration: string;
  keyTopics: string[];
}

interface SubPointsResponse {
  success: boolean;
  subPoints: Array<SummarySubPoint | { error: string }>;
}

interface MainResponse {
  success: boolean;
  title: string;
  duration: string;
  keyTopics: string[];
  points?: string;
  topics?: string;
}

export async function fetchTheoryData(videoId: string): Promise<TheoryContent> {
  try {
    // Fetch sub points (timestamps and bullet points)
    const subPointsResponse = await axios.post<SubPointsResponse>(
      'http://localhost:3000/SummarySubPoints',
      { videoId }
    );

    // Fetch main title card
    const mainResponse = await axios.post<MainResponse>(
      'http://localhost:3000/SummaryMain',
      { videoId }
    );
    console.log('main',mainResponse,mainResponse.data)

    // Log responses for debugging
    console.log('SummarySubPoints response:', subPointsResponse.data);
    console.log('SummaryMain response:', mainResponse.data);

    // Validate responses
    if (!mainResponse.data.success) {
      throw new Error('SummaryMain API returned success: false');
    }
    if (
      !mainResponse.data.title ||
      typeof mainResponse.data.title !== 'string' ||
      !mainResponse.data.duration ||
      typeof mainResponse.data.duration !== 'string' ||
      !Array.isArray(mainResponse.data.keyTopics)
    ) {
      throw new Error('SummaryMain response has invalid structure');
    }

    if (!subPointsResponse.data.success) {
      throw new Error('SummarySubPoints API returned success: false');
    }

    // Filter out error objects and validate subPoints
    const validSubPoints = subPointsResponse.data.subPoints.filter(
      (point): point is SummarySubPoint =>
        !('error' in point) &&
        typeof point.timestamp === 'string' &&
        typeof point.title === 'string' &&
        typeof point.subtitle === 'string' &&
        typeof point.summary === 'string' &&
        Array.isArray(point.tips)
    );

    if (
      subPointsResponse.data.subPoints.length > 0 &&
      'error' in subPointsResponse.data.subPoints[0]
    ) {
      console.warn('No valid sections generated:', subPointsResponse.data.subPoints[0].error);
    }

    // Map subPoints to TheoryContent sections
    const sections = validSubPoints.map(point => ({
      time: point.timestamp,
      content: point.title,
      theory: {
        details: point.summary, // Map summary to details
        badge: point.subtitle, // Map subtitle to badge
        points: 0, // Default, as API doesn't provide points
        tips: point.tips,
      },
    }));

    // Combine the responses into TheoryContent structure
    const theoryContent: TheoryContent = {
      title: mainResponse.data.title,
      duration: mainResponse.data.duration,
      sections,
      keyTopics: mainResponse.data.keyTopics,
    };

    return theoryContent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to fetch theory data for videoId ${videoId}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } else {
      console.error('Unexpected error fetching theory data:', error);
    }
    throw error; // Let the caller handle the error
  }
}