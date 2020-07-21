import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { FileComponentsPage, FileDetailPage, FileUpdatePage } from './file.po';

describe('File e2e test', () => {
  let loginPage: LoginPage;
  let fileComponentsPage: FileComponentsPage;
  let fileUpdatePage: FileUpdatePage;
  let fileDetailPage: FileDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Files';
  const SUBCOMPONENT_TITLE = 'File';
  let lastElement: any;
  let isVisible = false;

  const name = 'name';

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

  it('should load Files', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'File')
      .first()
      .click();

    fileComponentsPage = new FileComponentsPage();
    await browser.wait(ec.visibilityOf(fileComponentsPage.title), 5000);
    expect(await fileComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(fileComponentsPage.entities.get(0)), ec.visibilityOf(fileComponentsPage.noResult)), 5000);
  });

  it('should create File', async () => {
    initNumberOfEntities = await fileComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(fileComponentsPage.createButton), 5000);
    await fileComponentsPage.clickOnCreateButton();
    fileUpdatePage = new FileUpdatePage();
    await browser.wait(ec.visibilityOf(fileUpdatePage.pageTitle), 1000);
    expect(await fileUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await fileUpdatePage.setNameInput(name);
    await fileUpdatePage.setFileInput(file);

    await fileUpdatePage.save();
    await browser.wait(ec.visibilityOf(fileComponentsPage.title), 1000);
    expect(await fileComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await fileComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last File', async () => {
    fileComponentsPage = new FileComponentsPage();
    await browser.wait(ec.visibilityOf(fileComponentsPage.title), 5000);
    lastElement = await fileComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last File', async () => {
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

  it('should view the last File', async () => {
    fileDetailPage = new FileDetailPage();
    if (isVisible && (await fileDetailPage.pageTitle.isDisplayed())) {
      expect(await fileDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await fileDetailPage.getNameInput()).toEqual(name);

      expect(await fileDetailPage.getFileInput()).toEqual(file);
    }
  });

  it('should delete last File', async () => {
    fileDetailPage = new FileDetailPage();
    if (isVisible && (await fileDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await fileDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(fileComponentsPage.title), 3000);
      expect(await fileComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await fileComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Files tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
