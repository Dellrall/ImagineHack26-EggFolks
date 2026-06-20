# To run the data service
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend-data; go run ./cmd/data-service/"