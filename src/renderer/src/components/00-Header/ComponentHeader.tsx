import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Bell, Search } from 'lucide-react'

import './ComponentHeader.css'
import { Sidebar } from 'primereact/sidebar'
import QuickNotificationSidebar from '../07-QuickNotificationSidebar/QuickNotificationSidebar'

interface ComponentHeaderProps {
  title: string
  subtitle: string
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({ title, subtitle }) => {
  const [visibleRight, setVisibleRight] = useState<boolean>(false)

  return (
    <div className="flex justify-content-between py-1 px-4 headerIndiv">
      <div className="flex flex-column">
        <p className="text-lg font-bold pb-1">{title}</p>
        <p className="text-xs">{subtitle}</p>
      </div>

      {/* Search input with Lucide icon inside */}
      <div className="flex align-items-center gap-3">
        <div className="custom-icon-field">
          <Search className="lucide-search-icon" size={18} />
          <InputText placeholder="Search" className="search-input" />
        </div>
        <Bell strokeWidth={1.25} onClick={() => setVisibleRight(true)} className="cursor-pointer" />
      </div>

      <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
        <QuickNotificationSidebar />
      </Sidebar>
    </div>
  )
}

export default ComponentHeader
