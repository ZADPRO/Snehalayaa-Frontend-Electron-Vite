// import { FileSpreadsheet } from 'lucide-react';
// import { Button } from 'primereact/button';
// import { Toolbar } from 'primereact/toolbar';
// import { Tooltip } from 'primereact/tooltip';
// import React from 'react';

// const SettingsUserRoles: React.FC = () => {

//       const leftToolbarTemplate = () => (
//     <div className="flex gap-2">
//       <Button
//         icon={<Plus size={16} strokeWidth={2} />}
//         severity="success"
//         tooltip="Add Supplier"
//         disabled={isAnySelected}
//         tooltipOptions={{ position: 'left' }}
//         onClick={() => setVisibleRight(true)}
//       />
//       <Button
//         icon={<Pencil size={16} strokeWidth={2} />}
//         severity="info"
//         tooltip="Edit Supplier"
//         tooltipOptions={{ position: 'left' }}
//         disabled={!isSingleSelected}
//         onClick={() => setVisibleRight(true)}
//       />
//       <Button
//         icon={<Trash2 size={16} strokeWidth={2} />}
//         severity="danger"
//         tooltip="Delete Suppliers"
//         tooltipOptions={{ position: 'left' }}
//         disabled={!isAnySelected}
//         onClick={handleDelete}
//       />
//     </div>
//   )

//   const rightToolbarTemplate = () => (
//     <div className="flex gap-2">
//       <Button
//         icon={<FileSpreadsheet size={16} strokeWidth={2} />}
//         severity="success"
//         tooltip="Export as Excel"
//         tooltipOptions={{ position: 'left' }}
//         onClick={handleExportExcel}
//         loading={exportLoading.excel}
//         disabled={exportLoading.excel}
//       />
//       <Button
      
//       />
//     </div>
//   )

//     return (
//         <div>
//  <Toolbar className="mb-2" left={leftToolbarTemplate} right={rightToolbarTemplate} />
//       <Tooltip target=".p-button" position="left" />
//         </div>
//     );
// };

// export default SettingsUserRoles;