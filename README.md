# teste02

## Configuracao do Supabase

O login do gestor usa o Supabase Auth. Os produtos podem ser armazenados na tabela definida em `supabase/schema.sql`.

1. Crie um projeto em https://supabase.com.
2. Abra o SQL Editor e execute `supabase/schema.sql`.
3. Em Authentication > Users, crie o usuario do gestor com e-mail e senha.
4. Em Project Settings > API, copie a Project URL e a chave publica `anon` para `js/supabase-config.js`:

```js
window.CIT_SUPABASE_URL = 'https://seu-projeto.supabase.co';
window.CIT_SUPABASE_ANON_KEY = 'sua-chave-anon';
```

Use somente a chave publica `anon` no navegador. Nunca coloque a chave `service_role` neste projeto.
