import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Sunday",
    callsMade: 4000,
    callsAnswered: 2400,
  },
  {
    name: "Monday",
    callsMade: 3000,
    callsAnswered: 1398,
  },
  {
    name: "Tuesday",
    callsMade: 3100,
    callsAnswered: 2670,
  },
  {
    name: "Wednesday",
    callsMade: 3908,
    callsAnswered: 2780,
  },
  {
    name: "Thursday",
    callsMade: 4800,
    callsAnswered: 1890,
  },
  {
    name: "Friday",
    callsMade: 3800,
    callsAnswered: 2390,
  },
  {
    name: "Saturday",
    callsMade: 4300,
    callsAnswered: 3490,
  },
];

const LineChartRechart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="callsMade"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="Calls made"
        />
        <Line
          type="monotone"
          dataKey="callsAnswered"
          stroke="#82ca9d"
          name="Calls answered"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartRechart;
