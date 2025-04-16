# Configuração
$apiKey = "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"
$apiUrl = "https://api.openrouter.ai/api/v1/chat/completions"

Write-Host "=== TESTANDO API OPENROUTER ==="
Write-Host "URL: $apiUrl"

# Criar o arquivo temporário com o corpo da requisição
$body = @{
    model = "mistralai/mistral-7b-instruct:free"
    messages = @(
        @{
            role = "system"
            content = "Você é um personal trainer profissional especializado em fitness e nutrição. Forneça respostas detalhadas e personalizadas sobre exercícios, nutrição e bem-estar, mantendo um tom profissional e motivador."
        }
        @{
            role = "user"
            content = "ola"
        }
    )
    max_tokens = 800
    temperature = 0.7
    top_p = 0.95
    stream = $false
} | ConvertTo-Json -Compress

$tempFile = [System.IO.Path]::GetTempFileName()
$body | Out-File -FilePath $tempFile -Encoding utf8

Write-Host "Testando API..."
Write-Host "Corpo da requisição:"
Get-Content $tempFile

# Fazer a requisição usando curl
curl -X POST $apiUrl `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $apiKey" `
  -H "HTTP-Referer: https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app" `
  -H "X-Title: FitJourney" `
  -d "@$tempFile"

# Remover o arquivo temporário
Remove-Item $tempFile 