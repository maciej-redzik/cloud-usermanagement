Install-Module -Name Az -AllowClobber -Scope AllUsers

#Creds
$adminSqlLogin = "admin-sql"
$adminSqlPass = "<password_goes_here>"

#Global variables
$resourceGroup = "default-resource-group"
$sqlServerName = "<server_name>"

#Connect-AzAccount



$sqlServer = Get-AzSqlServer -ResourceGroupName $resourceGroup -ServerName $sqlServerName

if($null -eq $sqlServer) {
    $sqlServer = New-AzSqlServer -ResourceGroupName $resourceGroup -ServerName $sqlServerName `
    -Location 'Germany West Central' `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $adminSqlLogin, $(ConvertTo-SecureString -String $adminSqlPass -AsPlainText -Force))

    $sqlServerFirewallRule = New-AzSqlServerFirewallRule -ResourceGroupName $resourceGroup -ServerName $sqlServerName -FirewallRuleName "AllowedIPs" -StartIpAddress "0.0.0.0" -EndIpAddress "255.255.255.255"
}

$sqlDatabase = Get-AzSqlDatabase -ResourceGroupName $resourceGroup -ServerName $sqlServerName -DatabaseName "cloud-usermanagement" -ErrorAction SilentlyContinue

if($null -eq $sqlDatabase) {
    $sqlDatabase = New-AzSqlDatabase -ResourceGroupName $resourceGroup -ServerName $sqlServerName -DatabaseName "cloud-usermanagement" 
}