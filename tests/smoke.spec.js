// @ts-check
const { test, expect } = require('@playwright/test');

// Смоук-тест: страница должна открываться и рендериться без JS-ошибок.
// Поведение приложения зависит от доступности Firebase CDN в момент
// запуска: если сеть/gstatic.com недоступны — приложение уходит в
// локальный режим и сразу показывает панель; если доступны — показывает
// форму входа. Тест НЕ логинится и не пишет данные в Firebase — проверяет
// оба допустимых исхода, а не один конкретный.

test('index.html открывается без ошибок (онлайн или офлайн-режим)', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err));

  await page.goto('/index.html');

  await expect(page).toHaveTitle('Рабочая панель');

  const authGate = page.locator('#authGate');
  const cloudNote = page.locator('#cloudNote');
  await expect
    .poll(async () => (await authGate.isVisible()) || (await cloudNote.isVisible()))
    .toBe(true);

  if (await authGate.isVisible()) {
    // Онлайн-режим: показана форма входа, данные ещё не загружены.
    await expect(authGate.locator('#authEmail')).toBeVisible();
    await expect(authGate.locator('#authPass')).toBeVisible();
    await expect(authGate.locator('button')).toHaveText('Войти');
  } else {
    // Офлайн-режим: гейт скрыт, приложение сразу отрендерило локальные данные.
    await expect(cloudNote).toContainText('Локальный режим');
  }

  // Основные вкладки присутствуют в разметке независимо от режима.
  for (const id of ['viewActualka', 'viewToday', 'viewSchema', 'viewDb', 'viewDeals', 'viewArchive', 'viewSettings']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }

  expect(pageErrors, `Необработанные JS-ошибки: ${pageErrors.map(String).join('; ')}`).toHaveLength(0);
});
