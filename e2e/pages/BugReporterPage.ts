import { Page, Locator } from '@playwright/test';

export class BugReporterPage {
  readonly page: Page;
  readonly headingTitle: Locator;
  readonly statusBadge: Locator;
  readonly manualLogInput: Locator;
  readonly generateReportButton: Locator;
  readonly networkCaptureButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headingTitle = page.locator('text=AI Bug Reporter');
    this.statusBadge = page.locator('text=Servidor de IA Operativo');
    this.manualLogInput = page.locator('textarea');
    this.generateReportButton = page.locator('button:has-text("Generar Reporte con IA")');
    this.networkCaptureButton = page.locator('button:has-text("Capturar Errores de Red")');
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillManualLog(text: string) {
    await this.manualLogInput.fill(text);
  }

  async mockAiApiResponse(mockedReport: object) {
    await this.page.route('**/api/generate-bug-report', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedReport),
      });
    });
  }
}