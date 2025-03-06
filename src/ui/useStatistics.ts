import { useEffect, useState } from "react";
//d f
export function useStatistics(dataPointCount: number) {
  const [value, setValue] = useState<Statistics[]>([]);
  useEffect(() => {
    const unsub = window.electron.subscribeStatistics((stats) =>
      setValue((prev) => {
        const newData = [...prev, stats];

        if (newData.length > dataPointCount) {
          newData.shift();
        }
        return newData;
      })
    );
    return unsub;
  }, [dataPointCount]);

  return value;
}
