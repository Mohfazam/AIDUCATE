//@ts-ignore
export async function fetchTheoryContent(videoId: string): Promise<TheoryContent> {
    try {
      const response = await fetch('http://localhost:3000/theory-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch theory content');
      }
//@ts-ignore
      const data = await response.json() as TheoryResponse;
      return JSON.parse(data.content);
    } catch (error) {
      console.error('Error fetching theory content:', error);
      throw error;
    }
  }