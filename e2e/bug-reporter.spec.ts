import { test, expect } from '@playwright/test';
import { BugReporterPage } from './pages/BugReporterPage';

test.describe('AI Bug Reporter - UI & Functional Suite', () => {
  let reporterPage: BugReporterPage;

  test.beforeEach(async ({ page }) => {
    reporterPage = new BugReporterPage(page);
    await reporterPage.goto();
  });

  test('TC001 - Should render core interface elements properly', async () => {
    await expect(reporterPage.headingTitle.first()).toBeVisible();
    await expect(reporterPage.statusBadge.first()).toBeVisible();
    await expect(reporterPage.networkCaptureButton.first()).toBeVisible();
    await expect(reporterPage.manualLogInput).toBeVisible();
  });

  test('TC002 - Should accept text inputs in manual log section', async () => {
    const sampleLog = 'POST /api/checkout 500 Internal Server Error - Timeout';
    await reporterPage.fillManualLog(sampleLog);
    await expect(reporterPage.manualLogInput).toHaveValue(sampleLog);
  });

  test('TC003 - API Mocking: Intercept and validate bug generation flow', async () => {
    const mockReport = {
      title: 'Checkout API 500 Error',
      description: 'Network timeout during checkout execution',
      priority: 'P1 - High',
      expectedResult: 'HTTP 200 with order confirmation',
      actualResult: 'HTTP 500 Internal Server Error',
    };

    await reporterPage.mockAiApiResponse(mockReport);
    await reporterPage.fillManualLog('HTTP 500 /checkout');
    await reporterPage.generateReportButton.click();
  });
});