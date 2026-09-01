import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import NotFound from '../pages/NotFound';

import AdminLogin from '../pages/admin/AdminLogin';
import ProjectsManager from '../pages/admin/ProjectsManager';
import ProjectEditor from '../pages/admin/ProjectEditor';
import AboutSectionEditor from '../pages/admin/AboutSectionEditor';

import AboutPage from '../pages/AboutPage';
import SkillsPage from '../pages/SkillsPage';
import ExperiencePage from '../pages/ExperiencePage';
import ContactPage from '../pages/ContactPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      </Route>

      {/* Admin auth */}
      <Route path="/basantadmin/loginx670342" element={<AdminLogin />} />

      {/* Admin (protected) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/about" element={<AboutSectionEditor />} />
          <Route path="/admin/projects" element={<ProjectsManager />} />
          <Route path="/admin/projects/new" element={<ProjectEditor />} />
          <Route path="/admin/projects/:id/edit" element={<ProjectEditor />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
