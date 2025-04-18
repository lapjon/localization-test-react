import { test, expect } from '@playwright/test';

test.describe('Localization Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('domcontentloaded');

    // Wait for the language switcher by class name
    await page.waitForSelector('.language-switcher', { timeout: 5000 });
  });

  test('TC1: Verify that default language should be English', async ({ page }) => {
    const welcomeText = await page.getByRole('heading', { name: 'Welcome to Deep Dive!' }).textContent();
    expect(welcomeText).toContain('Welcome to Deep Dive!');
  });

  test('TC2: Verify that switching to each available language updates the UI', async ({ page }) => {
    const languages = [
      { code: 'sv', button: 'Svenska', expectedText: 'Välkommen till Deep Dive!' }, 
      { code: 'de', button: 'Deutsch', expectedText: 'Willkommen bei Deep Dive!' }, 
      { code: 'fr', button: 'Français', expectedText: 'Bienvenue à Deep Dive !' }, 
      { code: 'es', button: 'Español', expectedText: '¡Bienvenido a Deep Dive!' }, 
    ];

    for (const { code, expectedText } of languages) {
      await page.locator('.language-switcher select').selectOption(code);
      await page.waitForTimeout(500); // Ensure UI updates
      await expect(page.locator('.welcome-container h1')).toHaveText(expectedText, { timeout: 8000 });

    }
  });

  test('TC3: Verify that switching back to English restores the original UI text', async ({ page }) => {
    await page.locator('.language-switcher').click();
    await page.locator('.language-switcher select').selectOption('sv');
    await page.locator('.language-switcher select').selectOption('en');
    await page.waitForSelector('h1');
    const welcomeText = await page.getByRole('heading', { name: 'Welcome to Deep Dive!' }).textContent();
    expect(welcomeText).toContain('Welcome to Deep Dive!');
  });

  test('TC4: Verify language selection persists after a page reload', async ({ page }) => {
    const testLanguage = { code: 'de', button: 'Deutsch', expectedText: 'Willkommen bei Deep Dive!' };
    await page.locator('.language-switcher select').selectOption(testLanguage.code);
    await page.waitForTimeout(500); // Allow UI to update
    await expect(page.locator('.welcome-container h1')).toHaveText(testLanguage.expectedText, { timeout: 5000 });
    await page.reload();
    await page.waitForTimeout(500); 
    await expect(page.locator('.welcome-container h1')).toHaveText(testLanguage.expectedText, { timeout: 5000 });
  
  });

  test('TC5: Verify that language persists after navigating between pages', async ({ page }) => {

    // 🔹 Define a test language (change if needed)
    const testLanguage = { code: 'de', button: 'Deutsch', expectedText: 'Willkommen bei Deep Dive!' };

    console.log(`🔄 Switching to: ${testLanguage.button} (${testLanguage.code})`);

    // 🔹 Select the language from the dropdown
    await page.locator('.language-switcher select').selectOption(testLanguage.code);
    await page.waitForTimeout(500); // Allow UI to update

    // 🔹 Verify the text changes to the selected language
    await expect(page.locator('.welcome-container h1')).toHaveText(testLanguage.expectedText, { timeout: 5000 });

    console.log(`✅ Language switched to ${testLanguage.button}, navigating to Gear page...`);

    // 🔹 Navigate to another page (Gear Page)
    await page.locator('nav a[href="/gear"]').click();
    await page.waitForTimeout(500); // Ensure navigation completes

    await page.locator('nav a[href="/about"]').click();
    await page.waitForTimeout(500); // Ensure navigation completes

    await page.locator('nav a[href="/cart"]').click();
    await page.waitForTimeout(500); // Ensure navigation completes

    // 🔹 Navigate back to the Welcome Page
    await page.locator('a[href="/welcome"]').click();
    await page.waitForTimeout(500); // Ensure navigation completes

    console.log(`🔄 Navigated back to Welcome page, verifying language...`);

    // 🔹 Verify the language is still the selected one after navigation
    await expect(page.locator('.welcome-container h1')).toHaveText(testLanguage.expectedText, { timeout: 5000 });

    console.log(`✅ Language persisted after navigating between pages: ${testLanguage.button}`);
  });

  test("TC6: Verify navigation menu updates correctly in all languages for unsigned user", async ({ page }) => {
  
    // Define the languages and expected localized texts.
    // Adjust these expected texts to match your actual translation files.
    const languages = [
      { 
        code: "en", 
        expected: { 
          login: "Login",  // Site title link
          gear: "Gear", 
          about: "About", 
          cart: "Cart" 
        } 
      },
      { 
        code: "sv", 
        expected: { 
          login: "Logga in",  // Assuming the site title remains unchanged
          gear: "Utrustning", 
          about: "Om", 
          cart: "Varukorg" 
        } 
      },
      { 
        code: "de", 
        expected: { 
          login: "Anmelden", 
          gear: "Getriebe", 
          about: "Über", 
          cart: "Warenkorb" 
        } 
      },
      { 
        code: "fr", 
        expected: { 
          login: "Connexion", 
          gear: "Équipement", 
          about: "À propos de", 
          cart: "Panier" 
        } 
      },
      { 
        code: "es", 
        expected: { 
          login: "Acceso", 
          gear: "Equipo", 
          about: "Acerca de", 
          cart: "Carrito" 
        } 
      }
    ];
  
    for (const { code, expected } of languages) {
      console.log(`🔄 Switching to language: ${code}`);
  
      // Switch language using the <select> element in the language switcher.
      await page.locator('.language-switcher select').selectOption(code);
      await page.waitForTimeout(500); // Allow UI to update
  
      // Verify that the navigation links update correctly.
      await expect(page.locator(`nav a:has-text("${expected.gear}")`)).toBeVisible();
      await expect(page.locator(`nav a:has-text("${expected.about}")`)).toBeVisible();
      await expect(page.locator(`nav a:has-text("${expected.cart}")`)).toBeVisible();
      await expect(page.locator(`nav a:has-text("${expected.login}")`)).toBeVisible();
  
      console.log(`✅ Verified navigation menu for language: ${code}`);
    }
  });

  test('TC7: Verify "Signed in as" appears in all languages for signed-in user', async ({ page }) => {
    const user = {
        email: `testuser_${Date.now()}@example.com`,
        password: 'TestPassword123!'
    };

    // Navigate to Signup Page
    await page.goto('http://localhost:5173/signup');

    // Fill out the signup form
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    await page.fill('input[placeholder="Confirm Password"]', user.password); // Adjust if necessary

    // Submit the signup form
    await page.click('button[type="submit"]');

    // ✅ Wait for a success message or the login page indicator
    await Promise.race([
        
        page.waitForSelector('text=Login', { timeout: 5000 }), // If redirected to login page
        page.waitForURL('**/login', { timeout: 5000 }) // Or check for a URL change
    ]);

    console.log(`✅ User created with email: ${user.email}`);

    // Now, log in with the created user
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    await page.click('button[type="submit"]');

    // ✅ Wait for the navigation menu to confirm login
    await page.waitForSelector('text=Logged in as');

    // Verify login success
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // Switch languages and verify the "logged in as" text updates
    const languages = { 
      en: 'Logged in as:', 
      sv: 'Inloggad som:', 
      de: 'Eingeloggt als:',
      fr: 'Connecté en tant que:',
      es: 'Conectado como:'
    };

    for (const [code, expectedText] of Object.entries(languages)) {
        // Switch language via the UI
        await page.locator('.language-switcher select').selectOption(code);

        // Verify the navigation text updates
        await expect(page.locator('nav')).toContainText(expectedText);
        console.log(`✅ Verified navigation menu in ${code}`);
    }
});
  
test('TC8: Verify that error messages on the login page are displayed in all languages', async ({ page }) => {
  // Define expected error messages for different languages
  const errorMessages = {
      en: 'Invalid email or password.',
      sv: 'Ogiltig e-postadress eller lösenord.',
      de: 'Ungültige E-Mail oder ungültiges Passwort.',
      fr: 'E-mail ou mot de passe invalide.',
      es: 'Email o contraseña inválidos.'
      // Add more languages here as needed
  };

  // Step 1: Navigate to the login page
  await page.goto('http://localhost:5173/login');

  // Step 2: Enter invalid credentials
  await page.fill('input[type="email"]', 'wrong@example.com');
  await page.fill('input[type="password"]', 'WrongPassword123!');
  await page.click('button[type="submit"]');

  // Step 3: Verify error message in default language (English)
  await expect(page.locator('.error-message')).toHaveText(errorMessages.en);
  console.log('✅ Error message verified in English');

  // Step 4 & 5: Iterate through available languages
  for (const [code, expectedMessage] of Object.entries(errorMessages)) {
      // Switch language via the UI
      await page.locator('.language-switcher select').selectOption(code);

      // Trigger the error again
      await page.click('button[type="submit"]');

      // Step 6: Verify error message is updated in the selected language
      await expect(page.locator('.error-message')).toHaveText(expectedMessage);
      console.log(`✅ Error message verified in ${code}`);
  }
});

test('TC9: Verify that error messages on the checkout page are displayed in the selected language', async ({ page }) => {
  const user = {
      email: `testuser_${Date.now()}@example.com`,
      password: 'TestPassword123!'
  };

  // Define expected error messages for different languages
  const errorMessages = {
      en: {
          firstName: "First name is required.",
          lastName: "Last name is required.",
          address: "Address is required.",
          country: "Please select a country.",
          city: "City is required.",
          postalCode: "Postal code must be 5 digits.",
          cardName: "Name on card is required.",
          cardNumber: "Card number must be 16 digits.",
          expiryPast: "Expiry date cannot be in the past.",
          cvv: "CVV must be 3 digits."
      },
      sv: {
          firstName: "Förnamn måste anges.",
          lastName: "Efternamn måste anges.",
          address: "Adress måste anges.",
          country: "Välj ett land.",
          city: "Stad måste anges.",
          postalCode: "Postnumret måste vara 5 siffror.",
          cardName: "Namn på kortet måste anges.",
          cardNumber: "Kortnumret måste vara 16 siffror.",
          expiryPast: "Utgångsdatumet kan inte vara i det förflutna.",
          cvv: "CVV måste vara 3 siffror."
      },
      de: {
          firstName: "Vorname ist erforderlich.",
          lastName: "Nachname ist erforderlich.",
          address: "Adresse ist erforderlich.",
          country: "Bitte wählen Sie ein Land aus.",
          city: "Stadt ist erforderlich.",
          postalCode: "Postleitzahl muss 5-stellig sein.",
          cardName: "Name auf der Karte ist erforderlich.",
          cardNumber: "Kartennummer muss 16-stellig sein.",
          expiryPast: "Das Verfallsdatum darf nicht in der Vergangenheit liegen.",
          cvv: "CVV muss 3-stellig sein."
      },
      fr: {
          firstName: "Le prénom est obligatoire.",
          lastName: "Le nom de famille est obligatoire.",
          address: "L'adresse est obligatoire.",
          country: "Veuillez sélectionner un pays.",
          city: "La ville est obligatoire.",
          postalCode: "Le code postal doit être composé de 5 chiffres.",
          cardName: "Le nom sur la carte est obligatoire.",
          cardNumber: "Le numéro de la carte doit être composé de 16 chiffres.",
          expiryPast: "La date d'expiration ne peut pas être dans le passé.",
          cvv: "Le CVV doit être composé de 3 chiffres.",
      },
      es: {
          firstName: "El nombre es obligatorio.",
          lastName: "Apellidos obligatorios.",
          address: "Se requiere la dirección.",
          country: "Por favor, seleccione un país.",
          city: "Se requiere la ciudad.",
          postalCode: "El código postal debe tener 5 dígitos.",
          cardName: "Se requiere el nombre en la tarjeta.",
          cardNumber: "El número de tarjeta debe tener 16 dígitos.",
          expiryPast: "La fecha de caducidad no puede ser pasada.",
          cvv: "El CVV debe tener 3 dígitos.",
      }
  };

  // Step 1: Sign up a new user
  await page.goto('http://localhost:5173/signup');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.fill('input[placeholder="Confirm Password"]', user.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to login
  await page.waitForURL('**/login');
  console.log(`✅ User created with email: ${user.email}`);

  // Step 2: Log in
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.reload();

  // Wait for confirmation of login
  await page.waitForSelector('text=Logged in as');
  console.log('✅ User logged in successfully');

  // Step 3: Navigate to Gear page and add an item
  await page.goto('http://localhost:5173/gear');
  await page.click('button:has-text("Add to Cart")');
  console.log('✅ Item added to cart');

  // Step 4: Proceed to Checkout
  await page.goto('http://localhost:5173/cart');
  await page.locator('.proceed-checkout').click();
  console.log('✅ Navigated to Checkout page');

  // Step 5: Attempt to submit the checkout form with missing data
  await page.click('button[type="submit"]');

  // Step 6: Verify all error messages in default language (English)
  for (const [field, expectedMessage] of Object.entries(errorMessages.en)) {
      const locator = page.locator(`span.error:has-text("${expectedMessage}")`);
      await expect(locator).toBeVisible();
      console.log(`✅ Verified English error message: ${expectedMessage}`);
  }

  // Step 7 & 8: Iterate through available languages
  for (const [langCode, messages] of Object.entries(errorMessages)) {
      if (langCode === 'en') continue; // English already tested

      console.log(`🌍 Switching to language: ${langCode}`);

      // Switch language via the UI
      await page.locator('.language-switcher select').selectOption(langCode);

      // Re-trigger validation errors
      await page.click('button[type="submit"]');

      // Step 9: Verify each error message in the selected language
      for (const [field, expectedMessage] of Object.entries(messages)) {
          const locator = page.locator(`span.error:has-text("${expectedMessage}")`);
          await expect(locator).toBeVisible();
          console.log(`✅ Verified ${langCode.toUpperCase()} error message: ${expectedMessage}`);
      }
  }
});

test('TC10: Verify that error message on the signup page are displayed in all languages', async ({ page }) => {
  // Define expected error messages for all languages
  const errorMessages = {
      en: { passwordMismatch: 'Passwords do not match.' },
      sv: { passwordMismatch: 'Lösenorden matchar inte.' },
      de: { passwordMismatch: 'Passwörter stimmen nicht überein.' },
      fr: { passwordMismatch: 'Les mots de passe ne correspondent pas.' },
      es: { passwordMismatch: 'Las contraseñas no coinciden.' }
  };

  // Mapping of language codes to full names (for logging purposes)
  const languageNames = { en: 'English', sv: 'Swedish', de: 'German', fr: 'French', es: 'Spanish' };

  // Step 1: Navigate to the Signup page
  await page.goto('http://localhost:5173/signup');

  // Step 2: Fill out the form with mismatched passwords
  await page.fill('input[type="email"]', 'email@example.com');
  await page.fill('input[type="password"]', 'password123!');
  await page.fill('input[placeholder="Confirm Password"]', 'WrongPassword123!');
  await page.click('button[type="submit"]');

  // Step 3: Verify error messages in English (default language)
  for (const expectedMessage of Object.values(errorMessages.en)) {
      const locator = page.locator('p.error-message').filter({ hasText: expectedMessage });
      await expect(locator).toBeVisible({ timeout: 10000 });
      console.log(`✅ Verified English error message: ${expectedMessage}`);
  }

  // Step 4: Iterate through other languages
  for (const lang of ['sv', 'de', 'fr', 'es']) {
      console.log(`🔄 Switching to language: ${languageNames[lang]}`);

      // Step 5: Switch language via UI dropdown
      await page.locator('.language-switcher select').selectOption(lang);
      await page.waitForTimeout(1000); // Allow time for UI to update

      // Step 6: Submit the form again
      await page.click('button[type="submit"]');

      // Step 7: Log visible errors for debugging
      const errors = await page.locator('p.error-message').allTextContents();
      console.log(`Current error messages in ${languageNames[lang]}:`, errors);

      // Step 8: Verify error messages in the selected language
      for (const expectedMessage of Object.values(errorMessages[lang])) {
          const locator = page.locator('p.error-message').filter({ hasText: expectedMessage });
          await expect(locator).toBeVisible({ timeout: 10000 });
          console.log(`✅ Verified ${languageNames[lang]} error message: ${expectedMessage}`);
      }
  }
});

test('TC11: Verify that product names, descriptions, and prices update correctly when switching languages', async ({ page }) => {
  // Step 1: Navigate to the Gear Page and wait for necessary elements to load
  await page.goto('http://localhost:5173/gear');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for the language switcher by class name
  await page.waitForSelector('.language-switcher', { timeout: 5000 });

  // Step 2: Store product details in the default language (English)
  const product1NameLocator = page.locator('.gear-item:nth-child(1) h3');
  const product1DescriptionLocator = page.locator('.gear-item:nth-child(1) .gear-description');
  const product1PriceLocator = page.locator('.gear-item:nth-child(1) p');

  // Wait for the product name, description, and price to be visible
  await product1NameLocator.first().waitFor({ state: 'visible', timeout: 10000 });
  await product1DescriptionLocator.waitFor({ state: 'visible', timeout: 10000 });
  await product1PriceLocator.waitFor({ state: 'visible', timeout: 10000 });

  // Store initial product details in English (default language)
  const product1NameEnglish = await product1NameLocator.first().textContent(); 
  const product1DescriptionEnglish = await product1DescriptionLocator.textContent();
  const product1PriceEnglish = await product1PriceLocator.textContent();

  console.log("Initial Product Name in English:", product1NameEnglish);
  console.log("Initial Product Description in English:", product1DescriptionEnglish);
  console.log("Initial Product Price in English:", product1PriceEnglish);

  // Step 3: Iterate through each language and verify updates
  const languages = [
    { code: 'sv', button: 'Svenska', expectedText: 'Mask och snorkel' },
    { code: 'de', button: 'Deutsch', expectedText: 'Maske & Schnorchel-Set' },
    { code: 'fr', button: 'Français', expectedText: 'Ensemble masque et tuba' },
    { code: 'es', button: 'Español', expectedText: 'Conjunto de máscara y tubo' }
  ];

  for (const { code, expectedText } of languages) {
    console.log(`🔄 Switching to language: ${code}`);

    // Select the language from the dropdown
    await page.locator('.language-switcher select').selectOption(code);
    await page.waitForTimeout(500); // Allow UI to update

    // Verify that product names, descriptions, and prices are updated
    const product1Name = await product1NameLocator.first().textContent(); // Get the name in the selected language
    const product1Description = await product1DescriptionLocator.textContent(); // Get the description in the selected language
    const product1Price = await product1PriceLocator.textContent(); // Get the price in the selected language

    console.log(`Product Name in ${code}:`, product1Name);
    console.log(`Product Description in ${code}:`, product1Description);
    console.log(`Product Price in ${code}:`, product1Price);

    // Assert that product name and description are different after language switch
    expect(product1Name).not.toBe(product1NameEnglish); // Name should change to the localized version
    expect(product1Description).not.toBe(product1DescriptionEnglish); // Description should change
    expect(product1Price).toBe(product1PriceEnglish); // Assuming price stays the same

    // Assert the expected localized name appears for the product
    await expect(product1Name).toContain(expectedText);  // Ensure the product name matches expected localized text

    console.log(`✅ Verified product details in ${code}`);
  }
});
});

