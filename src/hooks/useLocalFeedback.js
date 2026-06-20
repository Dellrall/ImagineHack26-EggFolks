import { useMemo, useState } from 'react';

export function useLocalFeedback() {
  const [feedback, setFeedback] = useState([]);

  const latestFeedback = useMemo(() => feedback.slice().reverse(), [feedback]);

  function submitFeedback(entry) {
    setFeedback((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...entry,
      },
    ]);
  }

  return { feedback: latestFeedback, submitFeedback };
}
