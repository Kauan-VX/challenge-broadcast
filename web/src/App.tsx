import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Connections } from './pages/Connections';
import { Contacts } from './pages/Contacts';
import { Login } from './pages/Login';
import { Messages } from './pages/Messages';
import { SendMessage } from './pages/SendMessage';
import { Signup } from './pages/Signup';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Connections />} />
          <Route path="connections/:connectionId">
            <Route index element={<Navigate to="contacts" replace />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/send" element={<SendMessage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
