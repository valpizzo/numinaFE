import { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './LineChart';
const apiUrl = "http://localhost:3001";

function LandingPage() {
  const [actionText, setActionText] = useState('Add');
  const [dataByHour, setDataByHour] = useState({
    labels: [],
    datasets: [{
      label: '',
      data: [],
      borderColor: ''
    }]
  });

  useEffect((classType = 'pedestrian') => {
    axios.get(`${apiUrl}/cumulativeSum/${classType}`)
      .then((cumulativeSum) => {
        setDataByHour((prev) => ({
          ...prev,
          labels: cumulativeSum.data.map((count, hour) => {
            return `${hour}:00`;
          }),
          datasets: [{
            label: '# of Unique Track IDs for Pedestrians',
            data: cumulativeSum.data,
            borderColor: '#56BB80'
          }]
        }))
      })
  }, [])

  const addBicycleData = () => {
    if (actionText === 'Add') {
      axios.get(`${apiUrl}/cumulativeSum/bicycle`)
        .then((cumulativeSum) => {
          dataByHour.datasets.push({
            label: '# of Unique Track IDs for Bicycles',
            data: cumulativeSum.data,
            borderColor: '#000000'
          })
          setDataByHour((prev) => ({
            ...prev,
            datasets: [...prev.datasets]
          }));
          setActionText('Remove');
        })
    } else {
      dataByHour.datasets.pop();
      setDataByHour((prev) => ({
        ...prev,
        datasets: [...prev.datasets]
      }));
      setActionText('Add');
    }
  }

  return (
    <div>
      <button onClick={addBicycleData}>{actionText} Bicycle Data</button>
      <LineChart chartData={dataByHour} />
    </div>
  );
}

export default LandingPage;
