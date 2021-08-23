import React from 'react';
import ReactECharts from 'echarts-for-react';

const EchartView:React.FC<any> = props=>{
    return <ReactECharts
    {...props}
  />
}

export default EchartView;