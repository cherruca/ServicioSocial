import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import { pages } from '../util/pages';
import Layout from '../components/Layout';
import Css from '../pages/Css/Css';
import Contacts from '../pages/Contacts/Contacts';
import Circles from '../pages/Circles/Circles';
import Suggestions from '../pages/Suggestions/Suggestions';
import Commitment from '../pages/Commitment/Commitment';
import Documents from '../pages/Documents/Documents';
import Definition from '../pages/Definition/Definition';
import ServiceOptions from '../pages/ServiceOptions/ServiceOptions';
import Humanidades from '../pages/Humanidades/Humanidades';
import Login from '../pages/Login/Login';
import UserPage from '../pages/UserPage/UserPage';
import PetitionView from '../pages/petitionView';
import ListFaculty from '../components/ListFaculty';
import SocialServiceCenter from '../pages/SocialServiceCenter';
import ProjectManagement from '../pages/ProjectManagement';
import ProjectForm from '../pages/ProjectForm';
import ProjectList from '../pages/ProjectList';
import ActiveProjects from '../pages/ActiveProjects';
import AdminPage from '../pages/AdminPage/AdminPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={pages.home} element={<Home />} />
        <Route path={pages.css} element={<Css />} />
        <Route path={pages.contacts} element={<Contacts />} />
        <Route path={pages.circles} element={<Circles />} />
        <Route path={pages.suggestions} element={<Suggestions />} />
        <Route path={pages.commitment} element={<Commitment />} />
        <Route path={pages.documents} element={<Documents />} />
        <Route path={pages.definition} element={<Definition />} />
        <Route path={pages.serviceoptions} element={<ServiceOptions />} />
        <Route path={pages.humanidades} element={<Humanidades />} />
        <Route path={pages.login} element={<Login />} />
        <Route path={pages.user} element={<UserPage />} />
        <Route path={pages.admin} element={<AdminPage />} />

        <Route path={pages.socialservice} element={<SocialServiceCenter />} />
        <Route path={pages.projectlist} element={<ProjectList />} />
        <Route path={pages.activeprojects} element={<ActiveProjects />} />
      </Route>
      <Route path={pages.petitionview} element={<PetitionView />} />
      <Route path={pages.listfaculty} element={<ListFaculty />} />
      <Route path={pages.projectmanagement} element={<ProjectManagement />} />
      <Route path={pages.projectform} element={<ProjectForm />} />{' '}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};

export default AppRoutes;
