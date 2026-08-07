const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('When logged in', () => {

  beforeEach(async ({ page, request }) => {
    // 1. Limpiar base de datos
    await request.post('http://localhost:3003/api/testing/reset')
    
    // 2. Crear usuario
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Tester', username: 'tester', password: 'password123' }
    })

    // 3. Login y guardar estado (localStorage)
    const response = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const userResponse = await response.json() 

    await page.goto('http://localhost:5173')
    await page.evaluate((u) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(u))
    }, userResponse)

    await page.reload()
  })

  test('a new blog can be created', async ({ page }) => {
  const title = `Blog único ${Math.random().toString(36).substring(7)}`
  
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(title)
  await page.getByRole('textbox', { name: 'author' }).fill('Yo mismo')
  await page.getByRole('textbox', { name: 'url' }).fill('http://ejemplo.com')
  
  await page.getByRole('button', { name: 'CREATE' }).click()
  
  // 1. Aseguramos que el formulario desapareció
  await expect(page.getByRole('button', { name: 'CREATE' })).not.toBeVisible()
  
  // 2. Esperamos que el nuevo blog sea visible en la lista
  // Al usar getByRole, Playwright hace el 'auto-waiting' por ti.
  await expect(page.getByRole('link', { name: title })).toBeVisible({ timeout: 15000 })
})

  test('a blog can be liked', async ({ page, request }) => {
    // 1. Setup vía API
    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    const title = `Blog para like ${Math.random().toString(36).substring(7)}`;

    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor', url: 'http://test.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload(); 
    await page.getByRole('link', { name: title }).click();
    
    // Identificar elementos
    const blogContainer = page.locator('div', { has: page.getByRole('heading', { name: title }) });
    const likeButton = blogContainer.getByRole('button', { name: 'like' });
    const likesParagraph = blogContainer.locator('p:has-text("likes")');

    // 2. Acción: Simplemente haz click. No necesitas Promise.all para esperar la red.
    await likeButton.click();

    // 3. Validación: Playwright reintentará este expect hasta que el texto sea "1 likes"
    await expect(likesParagraph).toContainText('1');
  })

  test('the user can delete their own blog', async ({ page, request }) => {
    const title = `Blog a borrar ${Math.random().toString(36).substring(7)}`;

    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'tester', password: 'password123' }
    })
    const { token } = await loginResponse.json()
    
    await request.post('http://localhost:3003/api/blogs', {
      data: { title, author: 'Autor de prueba', url: 'http://ejemplo.com' },
      headers: { Authorization: `Bearer ${token}` }
    })

    await page.reload()

    await page.getByRole('link', { name: title }).click();
    
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'remove' }).click();
    page.on('response', resp => console.log('Respuesta recibida:', resp.url(), resp.status()));
    await expect(page.getByRole('link', { name: title })).not.toBeVisible();
  })
})