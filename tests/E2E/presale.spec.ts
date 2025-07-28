import { test, expect, BrowserContext, Page, chromium, firefox } from '@playwright/test';
import { PageManager } from '../../support/PageObject/pageManager';
import { env } from '../../support/data';
import { checkVisibility } from '../../support/PageObject/pageManager';
import { userVerification } from '../../support/make_test_user_verify';
import { Wallet } from 'ethers';

const wallet = Wallet.createRandom();
console.log('New wallet address:', wallet.address);

const { stageBaseUrl, stageAdminUrl } = env;

test.describe("E2E: Investor + Admin presale flow", () => {
    let pm: PageManager
    let investorContext: BrowserContext;
    let investorPage: Page;
    let investorPM: PageManager;

    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminPM: PageManager;

    test.beforeAll(async () => {
        const browser1 = await chromium.launch({ headless: true });

        investorContext = await browser1.newContext({ storageState: 'playwright/.auth/invest_login.json' });
        
        investorPage = await investorContext.newPage();
        
        await investorPage.goto(stageBaseUrl);
        
        pm = new PageManager(investorPage);
        
        investorPM = new PageManager(investorPage);
    });

    test.afterEach(async () => {
        await investorPage.close();
    });


    test("Investor + Admin presale flow", async () => {
        
        const browser2 = await chromium.launch({ headless: true });
        
        adminContext = await browser2.newContext({ storageState: 'playwright/.auth/admin_login.json' });
        
        adminPage = await adminContext.newPage();
        
        await adminPage.goto(stageAdminUrl);
        
        pm = new PageManager(adminPage);
        
        adminPM = new PageManager(adminPage);
        
        await adminPage.waitForTimeout(15000);
        
        await adminPM.adminTo().getUsersNavigation().click();
        
        await adminPage.waitForLoadState();
        
        await userVerification(adminPage, adminPM);
        
        await investorPage.bringToFront();
        
        await investorPage.reload();
        
        await checkVisibility([
            investorPM.dashboardTo().getWhiteList(),
            investorPM.dashboardTo().getWhiteListLogo(),
            investorPM.dashboardTo().getWhiteListDescription(),
            investorPM.dashboardTo().getWhiteListButton()
        ]);

        await investorPM.dashboardTo().getWhiteListButton().click();
        
        await checkVisibility([
            investorPM.whiteListTo().getGettingWhitelist(),
            investorPM.whiteListTo().getInvestmentAmountTitle(),
            investorPM.whiteListTo().getInvestmentAmountDescription(),
            investorPM.whiteListTo().getInvestmentSum(),
            investorPM.whiteListTo().getNextButton()
        ])

        await investorPM.whiteListTo().getInvestmentSum().fill('2222');
        
        await investorPM.whiteListTo().getNextButton().click();

        await checkVisibility([
            investorPM.whiteListTo().getMetaMaskLogo(),
            investorPM.whiteListTo().getMetaMaskTitle(),
            investorPM.whiteListTo().getMetaMaskDescription(),
            investorPM.whiteListTo().getBitbondLink(),
            investorPM.whiteListTo().getInputWalletAddress(),
            investorPM.whiteListTo().getBackButton(),
            investorPM.whiteListTo().getJoinPNMOCommunityButton()
        ])

        await investorPM.whiteListTo().getInputWalletAddress().fill('asdflkjhasdkjahsdkjashd');
        
        await expect(investorPM.whiteListTo().getInvalidWalletAddressMessage()).toBeVisible();
        
        await investorPM.whiteListTo().getInputWalletAddress().clear();
        
        await investorPM.whiteListTo().getBackButton().click();
        
        await expect(investorPM.whiteListTo().getGettingWhitelist()).toBeVisible();
        
        await investorPM.whiteListTo().getNextButton().click();
        
        await investorPM.whiteListTo().getInputWalletAddress().fill(wallet.address);
        
        await investorPM.whiteListTo().getJoinPNMOCommunityButton().click();

        await checkVisibility([
            investorPM.whiteListTo().getSuccessInvite(),
            investorPM.whiteListTo().getSuccessLogo(),
            investorPM.whiteListTo().getSuccessTitle(),
            investorPM.whiteListTo().getSuccessDescription(),
            investorPM.whiteListTo().getPNMOPresalePageButton(),
        ])
        
        await investorPM.whiteListTo().getPNMOPresalePageButton().click();
        
        await investorPage.waitForLoadState();
        
        await expect(investorPage).toHaveURL('https://www.staging.invest.penomo.com/presale');
        
        await expect(investorPM.whiteListTo().getNotificationForInitated()).toBeVisible();
        
        await expect(investorPM.presaleTo().getPresalePageBox()).toBeVisible();

        await adminPage.bringToFront();
        
        await adminPage.reload();
        
        await adminPage.waitForLoadState();
        
        await checkVisibility([
            adminPM.adminTo().getNavigationBar(),
            adminPM.adminTo().getPresaleNavigation()
        ]);
        
        await adminPM.adminTo().getPresaleNavigation().click();
        
        await expect(adminPage).toHaveURL('https://www.staging.admin.penomo.com/presale');
        
        await checkVisibility([
            adminPM.adminTo().getPresaleBox(),
            adminPM.adminTo().getPresaleNavBar(),
            adminPM.adminTo().getLatestWalletButton()
        ]);

        await adminPM.adminTo().getLatestWalletButton().click();
        
        await checkVisibility([
            adminPM.adminTo().getLattestWalletsBox(),
            adminPM.adminTo().getAddedWalletButton(),
            adminPM.adminTo().getCopyWalletButton()
        ]);

        await adminPM.adminTo().getAddedWalletButton().click();

        await checkVisibility([
            adminPM.adminTo().getConfirmWalletAdditionNotify(),
            adminPM.adminTo().getConfirmWalletTitle(),
            adminPM.adminTo().getConfirmWalletDescription(),
            adminPM.adminTo().getWalletAddresses(),
            adminPM.adminTo().getConfirmWalletCancelButton(),
            adminPM.adminTo().getConfirmWalletConfirmButton()
        ])

        await adminPM.adminTo().getConfirmWalletConfirmButton().click();

        await investorPage.bringToFront();

        await investorPage.waitForTimeout(5000);
        
        await expect(investorPM.presaleTo().getPresalePageNav()).toBeVisible();
        
        await investorPage.reload();
        
        await investorPage.waitForLoadState();
        
        await checkVisibility([
            investorPM.presaleTo().getTermsAndConditionsNotify(),
            investorPM.presaleTo().getConfirmTermsAndConditionsCheckBox(),
            investorPM.presaleTo().getTermsAndConditionsDescription(),
            investorPM.presaleTo().getTermsAndConditionsCancelButton(),
            investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton()
        ]);

        await expect(investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton()).toBeDisabled();
        
        await investorPM.presaleTo().getConfirmTermsAndConditionsCheckBox().click();
        
        await expect(investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton()).toBeEnabled();
        
        await investorPM.presaleTo().getTermsAndConditionsAgreeAndContinueButton().click();
        
        await investorPage.waitForLoadState();
        
        await expect(investorPM.presaleTo().getIFrameForTokens()).toBeVisible();

        await adminPage.bringToFront();
        
        await checkVisibility([
            adminPM.adminTo().getUsersNavigation(),
        ]);

        await adminPM.adminTo().getUsersNavigation().click();
        
        await adminPage.waitForLoadState();
        
        await expect(adminPM.adminTo().getUsersList()).toBeVisible();
        
        await expect(adminPM.adminTo().getLastUser()).toBeVisible();
        
        await adminPM.adminTo().getLastUser().click();
        
        await checkVisibility([
            adminPM.adminTo().getUserInformationLeft(),
            adminPM.adminTo().getUserInformatiomEditButton()
        ]);

        await adminPM.adminTo().getUserInformatiomEditButton().click();
        
        await checkVisibility([
            adminPM.adminTo().getEditionUserPage(),
            adminPM.adminTo().getHasPurchasedPRNMO(),
            adminPM.adminTo().getSelectHasPurchasedPRNMO()
        ])
        await adminPM.adminTo().getSelectHasPurchasedPRNMO().selectOption({ value: 'true' });
        
        await checkVisibility([
            adminPM.adminTo().getPRNMOTransaction(),
            adminPM.adminTo().getPRNMOAmount(),
            adminPM.adminTo().getUSDAmount(),
            adminPM.adminTo().getTransactionHash(),
            adminPM.adminTo().getInputToken(),
            adminPM.adminTo().getInputTransactionHash()
        ])
        
        await adminPM.adminTo().getInputToken().fill('123321');
        
        await adminPM.adminTo().getInputTransactionHash().fill('0x5bfff430adD6f397C8d0Cae0E28F9cDAD1a256Aa');
        
        await expect(adminPM.adminTo().getSaveButton()).toBeVisible();
        
        await adminPM.adminTo().getSaveButton().click();
        
        const notifies = adminPM.adminTo().getSuccessfulyUpdateNotify();
        
        await expect(notifies).toHaveCount(1);
        
        await expect(notifies).toBeVisible();

        await investorPage.bringToFront();
        
        await expect(investorPM.dashboardTo().getDashboardNav()).toBeVisible();
        
        await investorPM.dashboardTo().getDashboardNav().click();
        
        await investorPage.waitForLoadState();
        
        await browser2.close();
    })
})

