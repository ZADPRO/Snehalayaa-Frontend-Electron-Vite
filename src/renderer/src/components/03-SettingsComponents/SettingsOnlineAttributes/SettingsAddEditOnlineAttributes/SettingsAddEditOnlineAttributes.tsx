import React from 'react';
import { SettingsAddEditOnlineAttributesProps } from './SettingsAddEditOnlineAttributes.interface';

const SettingsAddEditOnlineAttributes: React.FC<SettingsAddEditOnlineAttributesProps> = ({
  selectedAttribute,
  onClose,
  reloadData
}) => {
  console.log('onClose', onClose)
  console.log('reloadData', reloadData)
  console.log('selectedAttribute', selectedAttribute)
    return (
        <div>

        </div>
    );
};

export default SettingsAddEditOnlineAttributes;
