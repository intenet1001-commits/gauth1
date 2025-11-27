const { chromium } = require('playwright');

async function testApp() {
  console.log('🚀 Starting Playwright test for localhost:3000...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to localhost:3000
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully\n');

    // Take a screenshot
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved to test-screenshot.png\n');

    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}\n`);

    // Click on "Claude Code Config Manager" tab
    console.log('🔍 Clicking on "Claude Code Config Manager" tab...');
    await page.click('text=Claude Code Config Manager');
    await page.waitForTimeout(1000);
    console.log('✅ Tab switched successfully\n');

    // Click "불러오기" button
    console.log('🔍 Clicking "Claude Code Config 불러오기" button...');
    await page.click('text=Claude Code Config 불러오기');
    await page.waitForTimeout(2000);
    console.log('✅ Button clicked\n');

    // Check for error message
    const errorMessage = await page.locator('.error-message, [style*="background: #f44336"]').textContent().catch(() => null);
    if (errorMessage) {
      console.log('❌ Error detected:', errorMessage);
    } else {
      console.log('✅ No error message detected\n');
    }

    // Check for success message
    const successSection = await page.locator('#claudeConfigSection').isVisible().catch(() => false);
    if (successSection) {
      console.log('✅ Config section is visible - Config loaded successfully!\n');

      // Get server count
      const serverCount = await page.locator('#claudeServerCount').textContent().catch(() => '0');
      console.log(`📊 Total MCP servers: ${serverCount}\n`);

      // Check for MCP server auth status
      console.log('🔍 Checking MCP server authentication status...');

      const authStatusElements = await page.locator('[style*="padding: 8px"]').allTextContents();
      console.log('\n📋 MCP Server Status:\n');

      for (const status of authStatusElements) {
        if (status.includes('인증됨') || status.includes('미인증') || status.includes('포트')) {
          console.log(`   ${status.trim()}`);
        }
      }

      // Detailed check for workspace-mcp servers
      const workspaceServers = await page.locator('text=/workspace-mcp/').count();
      console.log(`\n🔌 Found ${workspaceServers} workspace-mcp servers\n`);

      // Check if any server shows "포트 미설정"
      const portNotSet = await page.locator('text=포트 미설정').count();
      if (portNotSet > 0) {
        console.log(`⚠️  ${portNotSet} server(s) have port not set\n`);
      }

    } else {
      console.log('❌ Config section is not visible - Config may not have loaded\n');
    }

    // Generate report
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Page loads: ${title ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Config loads: ${successSection ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Web API works: ${!errorMessage || !errorMessage.includes('Electron') ? 'PASS' : 'FAIL'}`);
    console.log('='.repeat(60) + '\n');

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    if (portNotSet > 0) {
      console.log('   1. Add WORKSPACE_MCP_PORT environment variable to servers');
      console.log('   2. Improve UI to show clear "Add Port" button');
    }
    console.log('   3. Add visual indicator for MCP connection status');
    console.log('   4. Add "Test Connection" button for each MCP server');
    console.log('\n');

    // Keep browser open for manual inspection
    console.log('🔍 Browser will remain open for 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-error.png' });
    console.log('📸 Error screenshot saved to test-error.png');
  } finally {
    await browser.close();
    console.log('✅ Test completed!');
  }
}

testApp().catch(console.error);
