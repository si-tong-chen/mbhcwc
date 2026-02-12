import { focusNews } from '../data/focusNews';
import { associationNotices } from '../data/associationNotices';
import { internationalProjects } from '../data/internationalProjects';
import { expertVoices } from '../data/expertVoices';
import { healthLecturesUpcoming, healthLecturesReplay } from '../data/healthLectures';
import { topicVideos } from '../data/topicVideos';
import { maternalTopics } from '../data/maternalTopics';
import { products } from '../data/products';
import { promoCategories, promoServices } from '../data/promoServices';
import { tracks, courses } from '../data/trainingCourses';
import { homeHeroSlides } from '../data/homeHeroSlides';
import { homeLatestTips } from '../data/homeLatestTips';
import { charityHomes } from '../data/charityHomes';
import { careWorkstations } from '../data/careWorkstations';
import { workstationGallery } from '../data/workstationGallery';
import { associationTeamStructure } from '../data/associationTeamStructure';

const clone = (value) => JSON.parse(JSON.stringify(value));

const withPublishFields = (rows) => {
  const timestamp = new Date().toISOString();
  return rows.map((item) => ({
    ...item,
    status: 'published',
    created_at: timestamp,
    updated_at: timestamp,
    published_at: timestamp
  }));
};

export const buildStaticSeedModules = () => ({
  focusNews: withPublishFields(clone(focusNews)),
  associationNotices: withPublishFields(clone(associationNotices)),
  internationalProjects: withPublishFields(clone(internationalProjects)),
  expertVoices: withPublishFields(clone(expertVoices)),
  healthLecturesUpcoming: withPublishFields(clone(healthLecturesUpcoming)),
  healthLecturesReplay: withPublishFields(clone(healthLecturesReplay)),
  topicVideos: withPublishFields(clone(topicVideos)),
  trainingTracks: withPublishFields(clone(tracks)),
  trainingCourses: withPublishFields(clone(courses)),
  maternalTopics: withPublishFields(clone(maternalTopics)),
  homeHeroSlides: withPublishFields(clone(homeHeroSlides)),
  homeLatestTips: withPublishFields(clone(homeLatestTips)),
  charityHomes: withPublishFields(clone(charityHomes)),
  careWorkstations: withPublishFields(clone(careWorkstations)),
  workstationGallery: withPublishFields(clone(workstationGallery)),
  associationTeamStructure: withPublishFields(clone(associationTeamStructure)),
  products: withPublishFields(clone(products)),
  promoCategories: withPublishFields(clone(promoCategories)),
  promoServices: withPublishFields(clone(promoServices))
});
