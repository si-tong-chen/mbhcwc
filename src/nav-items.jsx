import { HomeIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import FocusNewsList from "./pages/FocusNewsList.jsx";
import FocusNewsDetail from "./pages/FocusNewsDetail.jsx";
import AssociationNoticeList from "./pages/AssociationNoticeList.jsx";
import AssociationNoticeDetail from "./pages/AssociationNoticeDetail.jsx";
import InternationalProjectList from "./pages/InternationalProjectList.jsx";
import InternationalProjectDetail from "./pages/InternationalProjectDetail.jsx";
import ExpertVoicesList from "./pages/ExpertVoicesList.jsx";
import ExpertVoiceDetail from "./pages/ExpertVoiceDetail.jsx";
import HealthLectureList from "./pages/HealthLectureList.jsx";
import HealthLectureDetail from "./pages/HealthLectureDetail.jsx";
import HealthLectureBooking from "./pages/HealthLectureBooking.jsx";
import MaternalTopicCategory from "./pages/MaternalTopicCategory.jsx";
import MaternalTopicDetail from "./pages/MaternalTopicDetail.jsx";
import MaternalKnowledgeArticle from "./pages/MaternalKnowledgeArticle.jsx";
import FamilyHealthPlan from "./pages/FamilyHealthPlan.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ProductList from "./pages/ProductList.jsx";
import TrainingHub from "./pages/TrainingHub.jsx";
import TrainingTrack from "./pages/TrainingTrack.jsx";
import TrainingCourseDetail from "./pages/TrainingCourseDetail.jsx";
import PromoHub from "./pages/PromoHub.jsx";
import PromoCategory from "./pages/PromoCategory.jsx";
import PromoServiceDetail from "./pages/PromoServiceDetail.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import AssociationIntro from "./pages/AssociationIntro.jsx";
import WorkstationGallery from "./pages/WorkstationGallery.jsx";
import TopicVideos from "./pages/TopicVideos.jsx";
import AdminApp from "./pages/AdminApp.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "FocusNewsList",
    to: "/news",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <FocusNewsList />,
  },
  {
    title: "Admin",
    to: "/admin/*",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <AdminApp />,
  },
  {
    title: "SearchResults",
    to: "/search",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <SearchResults />,
  },
  {
    title: "AssociationIntro",
    to: "/association",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <AssociationIntro />,
  },
  {
    title: "WorkstationGallery",
    to: "/stations",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <WorkstationGallery />,
  },
  {
    title: "TopicVideos",
    to: "/videos",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <TopicVideos />,
  },
  {
    title: "FocusNewsDetail",
    to: "/news/:slug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <FocusNewsDetail />,
  },
  {
    title: "AssociationNoticeList",
    to: "/notices",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <AssociationNoticeList />,
  },
  {
    title: "AssociationNoticeDetail",
    to: "/notices/:slug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <AssociationNoticeDetail />,
  },
  {
    title: "InternationalProjectList",
    to: "/projects",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <InternationalProjectList />,
  },
  {
    title: "InternationalProjectDetail",
    to: "/projects/:slug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <InternationalProjectDetail />,
  },
  {
    title: "ExpertVoicesList",
    to: "/experts",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <ExpertVoicesList />,
  },
  {
    title: "ExpertVoiceDetail",
    to: "/experts/:slug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <ExpertVoiceDetail />,
  },
  {
    title: "HealthLectureList",
    to: "/lectures",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HealthLectureList />,
  },
  {
    title: "HealthLectureDetail",
    to: "/lectures/:slug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HealthLectureDetail />,
  },
  {
    title: "HealthLectureBooking",
    to: "/lectures/book",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <HealthLectureBooking />,
  },
  {
    title: "MaternalTopicCategory",
    to: "/maternal/:topicSlug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <MaternalTopicCategory />,
  },
  {
    title: "MaternalTopicDetail",
    to: "/maternal/:topicSlug/:subSlug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <MaternalTopicDetail />,
  },
  {
    title: "MaternalKnowledgeArticle",
    to: "/maternal/:topicSlug/:subSlug/:articleSlug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <MaternalKnowledgeArticle />,
  },
  {
    title: "FamilyHealthPlan",
    to: "/plans/family-health",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <FamilyHealthPlan />,
  },
  {
    title: "ProductList",
    to: "/products",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <ProductList />,
  },
  {
    title: "ProductDetail",
    to: "/products/:slug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <ProductDetail />,
  },
  {
    title: "TrainingHub",
    to: "/training",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <TrainingHub />,
  },
  {
    title: "TrainingTrack",
    to: "/training/tracks/:trackSlug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <TrainingTrack />,
  },
  {
    title: "TrainingCourseDetail",
    to: "/training/courses/:courseSlug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <TrainingCourseDetail />,
  },
  {
    title: "PromoHub",
    to: "/promo",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <PromoHub />,
  },
  {
    title: "PromoCategory",
    to: "/promo/:categorySlug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <PromoCategory />,
  },
  {
    title: "PromoServiceDetail",
    to: "/promo/:categorySlug/:serviceSlug",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <PromoServiceDetail />,
  },
];
