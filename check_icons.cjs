const icons = require('@tabler/icons-react');

const usedIcons = [
  'IconDashboard', 'IconInbox', 'IconStethoscope', 'IconCalendarEvent', 'IconFirstAidKit', 'IconHistory', 'IconClipboardList', 'IconAlertTriangle', 'IconUserCircle', 'IconSettings', 'IconBadgeCheck',
  'IconSearch', 'IconSun', 'IconMoon', 'IconBell', 'IconLogout', 'IconMenu2',
  'IconMapPin', 'IconClock',
  'IconUsers', 'IconChecklist', 'IconPill', 'IconPhoneCall',
  'IconAmbulance', 'IconHeartRateMonitor', 'IconLungs', 'IconActivityHeartbeat',
  'IconUser', 'IconAlertCircle', 'IconChevronRight',
  'IconTrendingUp',
  'IconCamera', 'IconSignature',
  'IconPlus', 'IconMicrophone', 'IconSend'
];

usedIcons.forEach(icon => {
  if (!icons[icon]) {
    console.log('MISSING ICON:', icon);
  }
});
