import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ProfileComponentsPage, ProfileDetailPage, ProfileUpdatePage } from './profile.po';

describe('Profile e2e test', () => {
  let loginPage: LoginPage;
  let profileComponentsPage: ProfileComponentsPage;
  let profileUpdatePage: ProfileUpdatePage;
  let profileDetailPage: ProfileDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Profiles';
  const SUBCOMPONENT_TITLE = 'Profile';
  let lastElement: any;
  let isVisible = false;

  const phoneNumber = 'phoneNumber';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await browser.wait(ec.elementToBeClickable(loginPage.loginButton), 3000);
    await loginPage.login(username, password);
    await browser.wait(ec.visibilityOf(loginPage.logoutButton), 1000);
  });

  it('should load Profiles', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Profile')
      .first()
      .click();

    profileComponentsPage = new ProfileComponentsPage();
    await browser.wait(ec.visibilityOf(profileComponentsPage.title), 5000);
    expect(await profileComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(profileComponentsPage.entities.get(0)), ec.visibilityOf(profileComponentsPage.noResult)),
      5000
    );
  });

  it('should create Profile', async () => {
    initNumberOfEntities = await profileComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(profileComponentsPage.createButton), 5000);
    await profileComponentsPage.clickOnCreateButton();
    profileUpdatePage = new ProfileUpdatePage();
    await browser.wait(ec.visibilityOf(profileUpdatePage.pageTitle), 1000);
    expect(await profileUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await profileUpdatePage.setPhoneNumberInput(phoneNumber);

    await profileUpdatePage.save();
    await browser.wait(ec.visibilityOf(profileComponentsPage.title), 1000);
    expect(await profileComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await profileComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Profile', async () => {
    profileComponentsPage = new ProfileComponentsPage();
    await browser.wait(ec.visibilityOf(profileComponentsPage.title), 5000);
    lastElement = await profileComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Profile', async () => {
    browser
      .executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if ((await lastElement.isEnabled()) && (await lastElement.isDisplayed())) {
          browser
            .executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Profile', async () => {
    profileDetailPage = new ProfileDetailPage();
    if (isVisible && (await profileDetailPage.pageTitle.isDisplayed())) {
      expect(await profileDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await profileDetailPage.getPhoneNumberInput()).toEqual(phoneNumber);
    }
  });

  it('should delete last Profile', async () => {
    profileDetailPage = new ProfileDetailPage();
    if (isVisible && (await profileDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await profileDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(profileComponentsPage.title), 3000);
      expect(await profileComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await profileComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Profiles tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
