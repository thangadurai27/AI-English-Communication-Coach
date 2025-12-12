import { useEffect, useState } from 'react';
import { isMobileViewport, getDeviceType, getOrientation } from '../utils/mobile';

/**
 * Responsive Container Component
 * Provides responsive behavior and device information to children
 */
const ResponsiveContainer = ({ children, className = '' }) => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: isMobileViewport(),
    deviceType: getDeviceType(),
    orientation: getOrientation()
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo({
        isMobile: isMobileViewport(),
        deviceType: getDeviceType(),
        orientation: getOrientation()
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <div 
      className={`responsive-container ${className} ${deviceInfo.isMobile ? 'mobile' : 'desktop'} ${deviceInfo.orientation}`}
      data-device={deviceInfo.deviceType}
    >
      {typeof children === 'function' ? children(deviceInfo) : children}
    </div>
  );
};

export default ResponsiveContainer;
