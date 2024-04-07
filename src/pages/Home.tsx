import { useState } from "react";
import { Line } from "@ant-design/plots/es/components";
import { Flex, Row } from "antd";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  const config = {
    data,
    xField: "year",
    yField: "value",
  };

  return (
    <>
      <Line
        {...config}
        sizeField={1}
        autoFit={false}
        colorField="blue"
        loading={isLoading}
        coordinate={{
          type: "cartesian",
        }}
        title={{
          subtitle: "Diagramma",
          title: "O'quvchilar",
        }}
      />
      <Line
        {...config}
        sizeField={1}
        autoFit={false}
        colorField="blue"
        loading={isLoading}
        coordinate={{
          type: "polar",
        }}
        title={{
          subtitle: "Diagramma",
          title: "O'qituvchilar",
        }}
      />
    </>
  );
};

export default Home;
