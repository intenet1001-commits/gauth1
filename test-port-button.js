const { chromium } = require('playwright');

async function testPortButton() {
  console.log('🧪 Testing port add button...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  // Listen for page errors
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded\n');

    // Click Claude Code Config Manager tab
    await page.click('text=Claude Code Config Manager');
    await page.waitForTimeout(1000);
    console.log('✅ Switched to Claude Code Config Manager tab\n');

    // Click load config button
    await page.click('text=Claude Code Config 불러오기');
    await page.waitForTimeout(2000);
    console.log('✅ Loaded config\n');

    // Look for "포트 추가" button
    const portButton = await page.locator('button:has-text("포트 추가")').first();
    const isVisible = await portButton.isVisible().catch(() => false);

    if (!isVisible) {
      console.log('❌ Port add button not found!\n');
      console.log('Checking for servers with "포트 미설정"...');
      const portNotSetCount = await page.locator('text=포트 미설정').count();
      console.log(`Found ${portNotSetCount} servers with "포트 미설정"\n`);

      // Take screenshot
      await page.screenshot({ path: 'no-button.png', fullPage: true });
      console.log('📸 Screenshot saved to no-button.png\n');
    } else {
      console.log('✅ Found port add button!\n');

      // Take screenshot before click
      await page.screenshot({ path: 'before-click.png', fullPage: true });
      console.log('📸 Before-click screenshot saved\n');

      // Click the button
      console.log('🖱️  Clicking port add button...\n');
      await portButton.click();
      await page.waitForTimeout(3000);

      // Check for success message
      const successMsg = await page.locator('text=/포트.*추가되었습니다/').isVisible().catch(() => false);
      const errorMsg = await page.locator('[style*="background: #f44336"]').textContent().catch(() => null);

      if (successMsg) {
        console.log('✅ SUCCESS: Port added successfully!\n');
      } else if (errorMsg) {
        console.log('❌ ERROR:', errorMsg, '\n');
      } else {
        console.log('⚠️  No clear success or error message\n');
      }

      // Take screenshot after click
      await page.screenshot({ path: 'after-click.png', fullPage: true });
      console.log('📸 After-click screenshot saved\n');
    }

    // Wait for manual inspection
    console.log('Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'test-error-port.png' });
  } finally {
    await browser.close();
    console.log('✅ Test completed');
  }
}

testPortButton().catch(console.error);
