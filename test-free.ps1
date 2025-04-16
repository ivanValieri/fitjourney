# Configuração mínima
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer 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"
    "HTTP-Referer" = "https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app"
}

# Requisição simples
$body = @{
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

Write-Host "Testando modelo gratuito do Mistral..."
Write-Host "URL: https://openrouter.ai/api/v1/chat/completions"
Write-Host "Modelo: mistralai/mistral-7b-instruct:free"
Write-Host "Headers:", ($headers | ConvertTo-Json)
Write-Host "Body:", $body

try {
    $response = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/chat/completions" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "`nSucesso! Resposta:"
    Write-Host "------------------------"
    Write-Host $response.choices[0].message.content
    Write-Host "------------------------"
} catch {
    Write-Host "`nErro na requisição:"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Mensagem: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "Detalhes: $($_.ErrorDetails.Message)"
    }
} 