// import React, { useState, useEffect, Fragment } from 'react';
// import { Dropdown } from 'antd';
// import { useTranslation } from 'react-i18next';
// import { echartBar, echartLine, echartPie, echartBarStack, linearGradient } from 'utils';
// import { useLocation } from 'react-router-dom';

// // import {useAuth} from "global";
// import { HookDataTable } from 'hooks';
// import { Spin } from 'components';
// import Trello from '../../../components/trello';

// const Page = () => {
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     echartBar({
//       id: 'chart-profile',
//       label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'],
//       tooltip: {
//         backgroundColor: '#6B7280',
//         textStyle: { color: '#ffffff' },
//       },
//       grid: {
//         left: '20px',
//         bottom: '0',
//         right: '20px',
//       },
//       legend: {
//         textStyle: { color: '#ffffff' },
//       },
//       xAxis: {
//         show: false,
//       },
//       series: [
//         {
//           name: 'Total Profile',
//           type: 'bar',
//           barWidth: '8px',
//           itemStyle: {
//             color: 'rgba(255,255,255,0.3)',
//             borderRadius: 4,
//           },
//           data: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
//         },
//         {
//           name: 'Activated Profile',
//           type: 'bar',
//           barWidth: '8px',
//           itemStyle: {
//             color: '#ffffff',
//             borderRadius: 4,
//           },
//           data: [216, 169, 214, 215, 138, 162, 105, 212, 119, 124, 158, 210],
//         },
//       ],
//     });
//     echartLine({
//       id: 'chart-line1',
//       label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'],
//       color: ['#206DDF'],
//       series: [
//         {
//           name: 'Free',
//           type: 'line',
//           smooth: true,
//           showSymbol: false,
//           symbolSize: 0,
//           lineStyle: {
//             width: 3,
//             color: '#206DDF',
//           },
//           areaStyle: {
//             color: linearGradient({ hex: '#206DDF' }),
//           },
//           data: [150, 190, 228, 274, 212, 249, 278, 104, 219, 257, 115, 127],
//         },
//       ],
//     });
//     echartLine({
//       id: 'chart-purchasing',
//       label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'],
//       color: ['#206DDF', '#6B7280', '#F59E0B', '#10b981'],
//       legend: {
//         textStyle: {
//           color: '#ffffff',
//         },
//       },
//       grid: {
//         top: '40px',
//         left: '20px',
//         bottom: '30px',
//         right: '20px',
//       },
//       xAxis: {
//         axisLabel: { show: true },
//         axisLine: {
//           show: true,
//           lineStyle: { color: '#ffffff' },
//         },
//         splitLine: { show: false },
//         axisTick: {
//           show: true,
//           lineStyle: { color: '#ffffff' },
//         },
//       },
//       series: [
//         {
//           name: 'Free',
//           type: 'line',
//           smooth: true,
//           showSymbol: false,
//           symbolSize: 0,
//           lineStyle: {
//             width: 3,
//             color: '#206DDF',
//           },
//           areaStyle: {
//             color: linearGradient({ hex: '#206DDF' }),
//           },
//           data: [150, 190, 228, 274, 212, 249, 278, 104, 219, 257, 115, 127],
//         },
//         {
//           name: 'Silver',
//           type: 'line',
//           smooth: true,
//           showSymbol: false,
//           symbolSize: 0,
//           lineStyle: {
//             width: 3,
//             color: '#6B7280',
//           },
//           areaStyle: {
//             color: linearGradient({ hex: '#6B7280' }),
//           },
//           data: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
//         },
//         {
//           name: 'Gold',
//           type: 'line',
//           smooth: true,
//           showSymbol: false,
//           symbolSize: 0,
//           lineStyle: {
//             width: 3,
//             color: '#F59E0B',
//           },
//           areaStyle: {
//             color: linearGradient({ hex: '#F59E0B' }),
//           },
//           data: [184, 281, 114, 190, 199, 101, 239, 216, 231, 132, 102, 244, 257],
//         },
//         {
//           name: 'Platinum',
//           type: 'line',
//           smooth: true,
//           showSymbol: false,
//           symbolSize: 0,
//           lineStyle: {
//             width: 3,
//             color: '#10b981',
//           },
//           areaStyle: {
//             color: linearGradient({ hex: '#10b981' }),
//           },
//           data: [216, 169, 214, 215, 138, 162, 105, 212, 119, 124, 158, 210],
//         },
//       ],
//     });
//     echartBar({
//       id: 'chart-user',
//       label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'],
//       series: [
//         {
//           name: 'Total Payment',
//           type: 'bar',
//           barWidth: '8px',
//           itemStyle: {
//             color: '#EF4444',
//             borderRadius: 4,
//           },
//           data: [150, 190, 228, 274, 212, 249, 278, 104, 219, 257, 115, 127],
//         },
//         {
//           name: 'Partner Refund',
//           type: 'bar',
//           barWidth: '8px',
//           itemStyle: {
//             color: '#F59E0B',
//             borderRadius: 4,
//           },
//           data: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
//         },
//         {
//           name: 'Reference User',
//           type: 'bar',
//           barWidth: '8px',
//           itemStyle: {
//             color: '#3B82F6',
//             borderRadius: 4,
//           },
//           data: [184, 281, 114, 190, 199, 101, 239, 216, 231, 132, 102, 244, 257],
//         },
//         {
//           name: 'Activated Profile',
//           type: 'bar',
//           barWidth: '8px',
//           itemStyle: {
//             color: '#10b981',
//             borderRadius: 4,
//           },
//           data: [216, 169, 214, 215, 138, 162, 105, 212, 119, 124, 158, 210],
//         },
//       ],
//     });
//     echartLine({
//       id: 'chart-line2',
//       label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'],
//       color: ['#EF4444'],
//       series: [
//         {
//           name: 'Free',
//           type: 'line',
//           smooth: true,
//           showSymbol: false,
//           symbolSize: 0,
//           lineStyle: {
//             width: 3,
//             color: '#EF4444',
//           },
//           areaStyle: {
//             color: linearGradient({ hex: '#EF4444' }),
//           },
//           data: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
//         },
//       ],
//     });
//     echartPie({ id: 'total-active-profile' });
//     echartBarStack({ id: 'total-active-profile-year' });
//   }, [pathname]);

//   const year = (
//     <ul className="bg-blue-50">
//       <li className="p-2 hover:bg-blue-100">2021</li>
//       <li className="p-2 hover:bg-blue-100">2020</li>
//       <li className="p-2 hover:bg-blue-100">2019</li>
//       <li className="p-2 hover:bg-blue-100">2018</li>
//     </ul>
//   );
//   const nation = (
//     <ul className="bg-blue-50">
//       <li className="p-2 hover:bg-blue-100">Korea</li>
//       <li className="p-2 hover:bg-blue-100">Japan</li>
//       <li className="p-2 hover:bg-blue-100">China</li>
//       <li className="p-2 hover:bg-blue-100">United States</li>
//       <li className="p-2 hover:bg-blue-100">Vietnam</li>
//     </ul>
//   );
//   const [, DataTableSimple] = HookDataTable({
//     isLoading,
//     setIsLoading,
//     total: 0,
//     save: false,
//     showPagination: false,
//     showSearch: false,
//   });
//   return (
//     <Fragment>
//       <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={false}>
//         <div className="rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
//           <div className="bg-red-400 rounded-xl">
//             <div className="p-5 flex justify-between items-center">
//               <h2 className="text-lg text-white font-bold">Active Profile Report</h2>
//               <div className="flex">
//                 <Dropdown overlay={year} arrow placement="bottomRight">
//                   <div className="text-white bg-red-300 rounded p-2 mr-2">2020</div>
//                 </Dropdown>
//                 <Dropdown overlay={nation} arrow placement="bottomRight">
//                   <div className="text-white bg-red-300 rounded p-2">Global</div>
//                 </Dropdown>
//               </div>
//             </div>
//             <div className="h-56 relative -bottom-1" id="chart-profile" />
//           </div>
//           <div className="flex items-center">
//             <div className="p-5 grid grid-cols-2 gap-5 w-full">
//               <div className="rounded-xl p-5 bg-white flex items-center">
//                 <div className="px-2 py-1 rounded-md bg-indigo-50">
//                   <i className="las la-user-tie text-2xl text-indigo-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-bold text-black ">Seller Profiles</p>
//                   <p>3212</p>
//                 </div>
//               </div>
//               <div className="rounded-xl p-5 bg-white flex items-center">
//                 <div className="px-2 py-1 rounded-md bg-red-50">
//                   <i className="las la-users text-2xl text-red-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-bold text-black ">Buyer Profiles</p>
//                   <p>244</p>
//                 </div>
//               </div>
//               <div className="rounded-xl p-5 bg-white flex items-center">
//                 <div className="px-2 py-1 rounded-md bg-purple-50">
//                   <i className="las la-briefcase text-2xl text-purple-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-bold text-black ">Introductions</p>
//                   <p>20</p>
//                 </div>
//               </div>
//               <div className="rounded-xl p-5 bg-white flex items-center">
//                 <div className="px-2 py-1 rounded-md bg-green-50">
//                   <i className="las la-check-circle text-2xl text-green-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-bold text-black ">Success Deal</p>
//                   <p>12</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="rounded-xl shadow bg-gray-50 flex-col justify-between hidden 2xl:flex">
//           <div>
//             <div className="ml-5 mt-5 px-2 py-1 rounded-md bg-blue-50 inline-block">
//               <i className="las la-user-tie text-2xl text-blue-500" />
//             </div>
//             <h2 className="px-5 pt-1 text-2xl font-bold">875</h2>
//             <p className="px-5 pb-3">New Custommers</p>
//           </div>
//           <div className="h-36" id="chart-line1" />
//         </div>
//         <div className="rounded-xl shadow bg-blue-400 col-span-2 2xl:col-span-3">
//           <div className="p-5 flex justify-between items-center">
//             <h2 className="text-lg text-white font-bold">User Purchasing Report</h2>
//             <div className="flex">
//               <Dropdown overlay={year} arrow placement="bottomRight">
//                 <div className="text-white bg-blue-300 rounded p-2 mr-2">2020</div>
//               </Dropdown>
//               <Dropdown overlay={nation} arrow placement="bottomRight">
//                 <div className="text-white bg-blue-300 rounded p-2">Global</div>
//               </Dropdown>
//             </div>
//           </div>
//           <div className="h-48" id="chart-purchasing" />
//         </div>

//         <div className="rounded-xl shadow bg-green-400 col-span-2 2xl:col-span-3">
//           <div className="px-5 py-3 flex justify-between items-center">
//             <h2 className="text-lg font-bold">User Purchasing Report</h2>
//             <div className="flex">
//               <Dropdown overlay={year} arrow placement="bottomRight">
//                 <div className="text-black bg-green-300 rounded p-2 mr-2">2020</div>
//               </Dropdown>
//               <Dropdown overlay={nation} arrow placement="bottomRight">
//                 <div className="text-black bg-green-300 rounded p-2">Global</div>
//               </Dropdown>
//             </div>
//           </div>
//           <div className="h-48" id="chart-user" />
//         </div>
//         <div className="rounded-xl shadow bg-gray-50 hidden 2xl:flex flex-col justify-between">
//           <div>
//             <h2 className="px-5 pt-3 text-2xl font-bold">Sales Stats</h2>
//             <p className="px-5 pb-3">890,344 Sales</p>
//           </div>
//           <div className="h-36" id="chart-line2" />
//         </div>

//         <div className="rounded-xl shadow col-span-2 2xl:col-span-3 bg-blue-500">
//           <h2 className="p-5 py-4 text-lg font-bold text-white">Share of total 3454 active profiles</h2>
//           <div className="h-80" id="total-active-profile" />
//         </div>
//         <div className="rounded-xl shadow bg-gray-50 col-span-2 2xl:col-span-3">
//           <h2 className="px-5 py-3 text-lg font-bold">Total 6892 active profile in 2021</h2>
//           <div className="h-80" id="total-active-profile-year" />
//         </div>

//         <div className="rounded-xl shadow bg-gray-50 col-span-2 2xl:col-span-3">
//           <div className="p-5 flex justify-between items-center">
//             <h2 className="text-lg font-bold">Business Profiles Activity</h2>
//             <div className="flex">
//               <Dropdown overlay={year} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2 mr-2">2020</div>
//               </Dropdown>
//               <Dropdown overlay={nation} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2">Global</div>
//               </Dropdown>
//             </div>
//           </div>
//           {DataTableSimple(
//             [
//               {
//                 name: 'Công Ty Cổ Phần mật ong Bồ Đề Hoa',
//                 account: '',
//                 package: 'Gói bạc',
//                 date: '16/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty đấu giá hợp danh Thuận An',
//                 account: '',
//                 package: 'Gói bạch kim',
//                 date: '10/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty Cổ Phần Thịnh Phát Group',
//                 account: '',
//                 package: 'Gói vàng',
//                 date: '9/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty Cổ Phần Nhuộm Hà Nội',
//                 account: 'Marybeth Lorie',
//                 package: '',
//                 date: '8/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty Cổ Phần Cơ Điện Lạnh Bkre Bách Khoa',
//                 account: 'India Pamula',
//                 package: '',
//                 date: '2/08/2021',
//                 status: 'Approval',
//               },
//             ],
//             [
//               { title: t('Profile'), name: 'name', tableItem: {} },
//               { title: t('Package'), name: 'package', tableItem: {} },
//               { title: t('Start Date'), name: 'date', tableItem: {} },
//               { title: t('Status'), name: 'status', tableItem: {} },
//             ],
//           )}
//         </div>
//         <div className="rounded-xl shadow bg-gray-50 col-span-2 2xl:col-span-3">
//           <div className="p-5 flex justify-between items-center">
//             <h2 className="text-lg font-bold">Franchise Profiles Activity</h2>
//             <div className="flex">
//               <Dropdown overlay={year} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2 mr-2">2020</div>
//               </Dropdown>
//               <Dropdown overlay={nation} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2">Global</div>
//               </Dropdown>
//             </div>
//           </div>
//           {DataTableSimple(
//             [
//               {
//                 name: 'Công ty CP Đá ốp lát và Xây dựng Hà Nội',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '20/09/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Ecpsilky',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '13/09/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Tập đoàn Enagic',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '10/09/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'PA Enterprise Co., Ltd',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '20/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty Cổ Phần Mật ong Bồ Đề Hoa',
//                 account: '',
//                 package: 'Gói bạc',
//                 date: '17/08/2021',
//                 status: 'Approval',
//               },
//             ],
//             [
//               { title: t('Profile'), name: 'name', tableItem: {} },
//               { title: t('Package'), name: 'package', tableItem: {} },
//               { title: t('Start Date'), name: 'date', tableItem: {} },
//               { title: t('Status'), name: 'status', tableItem: {} },
//             ],
//           )}
//         </div>
//         <div className="rounded-xl shadow bg-gray-50 col-span-2 2xl:col-span-3">
//           <div className="p-5 flex justify-between items-center">
//             <h2 className="text-lg font-bold">Investor Profiles Activity</h2>
//             <div className="flex">
//               <Dropdown overlay={year} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2 mr-2">2020</div>
//               </Dropdown>
//               <Dropdown overlay={nation} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2">Global</div>
//               </Dropdown>
//             </div>
//           </div>
//           {DataTableSimple(
//             [
//               {
//                 name: 'Khổng Đức Duy',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '16/09/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Vũ Phạm Hải Sơn',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '13/09/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Đặng Thanh Ngà',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '19/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Phạm Mạnh Tân',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '12/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Kevin Nguyen',
//                 account: '',
//                 package: 'Gói cơ bản',
//                 date: '10/08/2021',
//                 status: 'Approval',
//               },
//             ],
//             [
//               { title: t('Profile'), name: 'name', tableItem: {} },
//               { title: t('Package'), name: 'package', tableItem: {} },
//               { title: t('Start Date'), name: 'date', tableItem: {} },
//               { title: t('Status'), name: 'status', tableItem: {} },
//             ],
//           )}
//         </div>
//         <div className="rounded-xl shadow bg-gray-50 col-span-2 2xl:col-span-3">
//           <div className="p-5 flex justify-between items-center">
//             <h2 className="text-lg font-bold">Monthly Profiles Activity</h2>
//             <div className="flex">
//               <Dropdown overlay={year} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2 mr-2">2020</div>
//               </Dropdown>
//               <Dropdown overlay={nation} arrow placement="bottomRight">
//                 <div className="text-black bg-gray-200 rounded p-2">Global</div>
//               </Dropdown>
//             </div>
//           </div>
//           {DataTableSimple(
//             [
//               {
//                 name: 'Công Ty Cổ Phần mật ong Bồ Đề Hoa',
//                 account: '',
//                 package: 'Gói bạc',
//                 date: '16/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty đấu giá hợp danh Thuận An',
//                 account: '',
//                 package: 'Gói bạch kim',
//                 date: '10/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty Cổ Phần Thịnh Phát Group',
//                 account: '',
//                 package: 'Gói vàng',
//                 date: '9/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty Cổ Phần Nhuộm Hà Nội',
//                 account: 'Marybeth Lorie',
//                 package: '',
//                 date: '8/08/2021',
//                 status: 'Approval',
//               },
//               {
//                 name: 'Công Ty Cổ Phần Cơ Điện Lạnh Bkre Bách Khoa',
//                 account: 'India Pamula',
//                 package: '',
//                 date: '2/08/2021',
//                 status: 'Approval',
//               },
//             ],
//             [
//               { title: t('Profile'), name: 'name', tableItem: {} },
//               { title: t('Package'), name: 'package', tableItem: {} },
//               { title: t('Start Date'), name: 'date', tableItem: {} },
//               { title: t('Status'), name: 'status', tableItem: {} },
//             ],
//           )}
//         </div>
//       </Spin>
//       <div className={'col-span-6'}>
//         <Trello
//           idRequest={1}
//           Get={() => ({
//             message: 'Success',
//             data: [
//               {
//                 frontColor: '#ffffff',
//                 backgroundColor: '#4a4a4a',
//                 tasks: [
//                   { id: '11', task_name: 'Task 1' },
//                   { id: '12', task_name: 'Task 2' },
//                   { id: '13', task_name: 'Task 3' },
//                 ],
//                 pages: 1,
//                 count: 3,
//                 allowActions: { allowCreate: true, allowEdit: true },
//                 id: '1',
//                 name: 'Opening',
//               },
//               {
//                 frontColor: '#ffffff',
//                 backgroundColor: '#4a90e2',
//                 tasks: [
//                   { id: '14', task_name: 'Task 4' },
//                   { id: '15', task_name: 'Task 5' },
//                   { id: '16', task_name: 'Task 6' },
//                 ],
//                 allowActions: { allowCreate: true, allowEdit: true },
//                 id: '2',
//                 name: 'Processing',
//               },
//               {
//                 frontColor: '#ffffff',
//                 backgroundColor: '#f5a623',
//                 tasks: [],
//                 allowActions: { allowCreate: true, allowEdit: true },
//                 id: '3',
//                 name: 'Pending',
//               },
//               {
//                 frontColor: '#ffffff',
//                 backgroundColor: '#d0021b',
//                 tasks: [],
//                 allowActions: { allowCreate: true, allowEdit: true },
//                 id: '4',
//                 name: 'Canceled',
//               },
//               {
//                 frontColor: '#ffffff',
//                 backgroundColor: '#417505',
//                 tasks: [],
//                 allowActions: { allowCreate: true, allowEdit: false },
//                 id: '5',
//                 name: 'Completed',
//               },
//               {
//                 frontColor: '#ffffff',
//                 backgroundColor: '#f8e71c',
//                 tasks: [],
//                 allowActions: { allowCreate: true, allowEdit: true },
//                 id: '11',
//                 name: 'Waiting for Approve',
//               },
//             ],
//           })}
//         />
//       </div>
//     </Fragment>
//   );
// };
// export default Page;


import React, { Fragment } from 'react';
import Wellcome from '../../../assets/images/welcome.png'
import './index.less'

const Page = () => {

  return (
    <Fragment>
      <div className='bg-white rounded-[10px] p-4 pb-[42px] homepage relative text-center flex justify-center items-end'>
        <div className='w-full'>
          <h1 className='text-lg sm:text-xl md:text-3xl lg:text-4xl text-center font-bold mb-[55px] sm:mb[60px] md:mb[70px] lg:mb-[80px] text-teal-900'>Chào mừng bạn đã đến với BALANCE!</h1>
          <div className='h-[265px] sm:h-[280px] md:h-[295px] lg:h-[310px] w-full '>
            <img src={Wellcome} alt="wellcome image" className='w-full h-full block' />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;

        // <h1 className='text-lg sm:text-xl md:text-2xl lg:text-4xl text-center font-bold absolute top-[25%] left-[22%]'>Chào mừng bạn đã đến với BALANCE!</h1>
        // <div className='h-[310px] w-full absolute bottom-[42px] left-[10px] right-[10px]'>
        //   <img src={Wellcome} alt="wellcome image" className='w-full h-full' />
        // </div>
