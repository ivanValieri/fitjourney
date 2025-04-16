$apiKey = "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"
$apiUrl = "https://openrouter.ai/api/v1/chat/completions"

Write-Host "=== TESTANDO API OPENROUTER ==="
Write-Host "URL: $apiUrl"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $apiKey"
    "HTTP-Referer" = "https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app"
    "X-Title" = "FitJourney"
}

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

Write-Host "Headers:"
$headers | ConvertTo-Json | Write-Host

Write-Host "Body:"
$body | Write-Host

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "=== RESPOSTA ==="
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Status Description: $($response.StatusDescription)"
    Write-Host "Content:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "=== ERRO ==="
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Response:"
    $rawError = $_.ErrorDetails.Message
    if ($rawError) {
        Write-Host $rawError
        try {
            $errorJson = $rawError | ConvertFrom-Json
            Write-Host "Error Details:"
            $errorJson | ConvertTo-Json -Depth 10 | Write-Host
        } catch {
            Write-Host "Raw Error:"
            Write-Host $rawError
        }
    } else {
        Write-Host $_.Exception.Message
    }
} 