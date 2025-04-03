# Configuração dos headers
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer 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"
    "HTTP-Referer" = "https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app"
    "X-Title" = "FitJourney"
}

# Corpo da requisição
$body = @{
    model = "mistralai/mistral-7b-instruct:free"
    messages = @(
        @{
            role = "system"
            content = "Você é um personal trainer profissional especializado em fitness e nutrição."
        }
        @{
            role = "user"
            content = "Olá, como vai?"
        }
    )
    max_tokens = 800
    temperature = 0.7
    top_p = 0.95
} | ConvertTo-Json -Depth 10

Write-Host "=== TESTANDO API OPENROUTER ==="
Write-Host "1. Testando endpoint /models..."

try {
    $modelsResponse = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/models" -Headers $headers -Method Get
    Write-Host "Modelos disponíveis:"
    $modelsResponse.data | Select-Object id, name
} catch {
    Write-Host "Erro ao buscar modelos:"
    Write-Host $_.Exception.Message
    Write-Host $_.Exception.Response.StatusCode
}

Write-Host "`n2. Testando chat completion..."

try {
    $chatResponse = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/chat/completions" -Headers $headers -Method Post -Body $body
    Write-Host "Resposta do chat:"
    $chatResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Erro no chat completion:"
    Write-Host $_.Exception.Message
    Write-Host $_.Exception.Response.StatusCode
    if ($_.ErrorDetails) {
        Write-Host "Detalhes do erro:"
        Write-Host $_.ErrorDetails.Message
    }
} 