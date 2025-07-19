import React from 'react'
import { Avatar } from 'primereact/avatar'
import { Divider } from 'primereact/divider'

import './QuickNotification.css'
import { AlertTriangle, ShoppingCart, UserPlus } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: 'New Order Placed',
    message: 'Order #1245 has been placed successfully.',
    time: 'Just now',
    icon: <ShoppingCart size={16} />,
    color: 'primary'
  },
  {
    id: 2,
    title: 'User Registered',
    message: 'John Doe has joined your platform.',
    time: '2 min ago',
    icon: <UserPlus size={16} />,
    color: 'success'
  },
  {
    id: 3,
    title: 'Inventory Alert',
    message: 'Low stock alert on product #A203.',
    time: '10 min ago',
    icon: <AlertTriangle size={16} />,
    color: 'warning'
  }
]

const QuickNotificationSidebar: React.FC = () => {
  return (
    <div className="quick-notification">
      <h3 className="mb-3">Notifications</h3>
      {notifications.map((n) => (
        <div key={n.id} className="notification-item">
          <div className="flex align-items-start gap-3">
            <Avatar
              icon={n.icon}
              shape="circle"
              className={`bg-${n.color}-100 text-${n.color}-600`}
            />
            <div className="flex flex-column">
              <span className="font-medium">{n.title}</span>
              <small className="text-color-secondary">{n.message}</small>
              <small className="text-xs mt-1 text-gray-500">{n.time}</small>
            </div>
          </div>
          <Divider className="my-2" />
        </div>
      ))}
    </div>
  )
}

export default QuickNotificationSidebar
