# Configuração de Conexão SSH - GM Celular

Este documento contém os dados de acesso e instruções para conexão SSH ao servidor cPanel.

## 🔑 Credenciais de Acesso

- **Host**: `gmcelular.com.br`
- **Usuário**: `gmso3652`
- **Senha**: `0G*6!pFOPf5ff8`
- **Porta**: `1157`

## 🚀 Como Conectar

### Via Terminal (Linux/macOS)

```bash
ssh gmso3652@gmcelular.com.br -p 1157
```

### Via PuTTY (Windows)

1. **Host Name**: `gmcelular.com.br`
2. **Port**: `1157`
3. **Connection Type**: `SSH`
4. Clique em **Open** e insira o usuário e senha quando solicitado.

## 🛠️ Comandos Úteis no Servidor

### Acessar a raiz do site (public_html)

```bash
cd public_html
```

### Verificar uso de disco

```bash
du -sh *
```

### Listar processos (CageFS)

```bash
ps aux
```

---

> [!IMPORTANT]
> Mantenha estas credenciais em segurança. O acesso SSH permite controle total sobre os arquivos do site e banco de dados.
