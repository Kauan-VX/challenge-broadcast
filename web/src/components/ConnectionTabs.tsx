import { Tab, Tabs } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  connectionId: string;
};

export function ConnectionTabs({ connectionId }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const base = `/connections/${connectionId}`;
  const current = pathname.includes('/messages')
    ? `${base}/messages`
    : `${base}/contacts`;

  return (
    <Tabs
      value={current}
      onChange={(_, value) => navigate(value)}
      sx={{
        mb: 4,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        '& .MuiTab-root': {
          minHeight: 48,
          gap: 1,
          color: 'text.secondary',
          '&.Mui-selected': { color: '#FFDE06' },
        },
        '& .MuiTabs-indicator': { backgroundColor: '#FFDE06', height: 3 },
      }}
    >
      <Tab
        label="Contatos"
        value={`${base}/contacts`}
        icon={<GroupOutlinedIcon fontSize="small" />}
        iconPosition="start"
      />
      <Tab
        label="Mensagens"
        value={`${base}/messages`}
        icon={<ChatBubbleOutlineRoundedIcon fontSize="small" />}
        iconPosition="start"
      />
    </Tabs>
  );
}
