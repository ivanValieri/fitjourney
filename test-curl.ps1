# Configuração
$apiKey = "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"
$url = "https://openrouter.ai/api/v1/chat/completions"

# Corpo da requisição em JSON
$bodyJson = @{
    model = "mistralai/mistral-7b-instruct:free"
    messages = @(
        @{
            role = "user"
            content = "Diga olá"
        }
    )
    max_tokens = 100
    temperature = 0.7
} | ConvertTo-Json -Depth 10

Write-Host "Testando API com curl..."
Write-Host "URL: $url"
Write-Host "Modelo: mistralai/mistral-7b-instruct:free"

# Salvando o corpo em um arquivo temporário
$bodyJson | Out-File -Encoding utf8 "request.json"

# Executando o curl
Write-Host "`nEnviando requisição..."
curl.exe -k -v -X POST $url `
    -H "Content-Type: application/json" `
    -H "Authorization: Bearer $apiKey" `
    -H "HTTP-Referer: https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app" `
    -H "X-Title: FitJourney" `
    -H "OpenAI-Organization: org-123abc" `
    -d "@request.json"

# Removendo o arquivo temporário
Remove-Item "request.json" 