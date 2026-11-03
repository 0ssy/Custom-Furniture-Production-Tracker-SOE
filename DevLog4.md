# DevLog 3 – MongoDB Setup and Backend Database Integration

## 1. MongoDB Shell Verification

Continued setting up MongoDB for the Custom Furniture Production Tracker.

Initially, PowerShell could not recognise the `mongosh` command, even though MongoDB Shell was installed.

### Problem encountered
PowerShell returned:

```text
mongosh: The term 'mongosh' is not recognized as a name of a cmdlet...
```

### Investigation
Located the MongoDB Shell executable using:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Programs\mongosh" -Recurse -Filter mongosh.exe | Select-Object -ExpandProperty FullName
```

Executable location:

```text
C:\Users\josep\AppData\Local\Programs\mongosh\mongosh.exe
```

Successfully launched MongoDB Shell using:

```powershell
& "$env:LOCALAPPDATA\Programs\mongosh\mongosh.exe"
```

## 2. MongoDB Connection Test

Executed the following command inside MongoDB Shell:

```javascript
db.runCommand({ ping: 1 })
```

Result:

```javascript
{ ok: 1 }
```

This confirmed that MongoDB Shell could communicate successfully with the local MongoDB Server.

## 3. Fixing the MongoDB Shell PATH

Added the MongoDB Shell installation directory to the Windows user PATH.

```powershell
$mongoshDir = "$env:LOCALAPPDATA\Programs\mongosh"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")

if (($userPath -split ";") -notcontains $mongoshDir) {
    $newPath = if ([string]::IsNullOrWhiteSpace($userPath)) {
        $mongoshDir
    } else {
        "$userPath;$mongoshDir"
    }

    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}
```

The current PowerShell session initially could not recognise the updated PATH.

Refreshed the current session using:

```powershell
$env:Path += ";$env:LOCALAPPDATA\Programs\mongosh"
```

Verified the installation:

```powershell
mongosh --version
```

Output:

```text
2.14.1
```

Also verified that PowerShell could locate the executable using:

```powershell
Get-Command mongosh
```

**Outcome:** MongoDB Shell is now accessible using the `mongosh` command in the refreshed terminal. A fresh terminal should be used to verify that the permanent PATH update is loaded automatically.

## 4. Root Environment Configuration

Inspected the existing project-level `.env` and `.gitignore` files.

The project already had a root-level `.env` file, so