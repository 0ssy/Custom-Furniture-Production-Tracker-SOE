## 14. MongoDB Windows Service Configuration

### Objective
Configure MongoDB to start automatically in the background whenever Windows starts.

### Environment
- Operating system: Windows
- MongoDB version: 9.0
- Windows service name: MongoDB
- MongoDB executable: `C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe`
- Configuration file: `C:\Program Files\MongoDB\Server\9.0\bin\mongod.cfg`

### Configuration Verification

Executed PowerShell commands to inspect the registered MongoDB Windows service.

Command:

```powershell
Get-Service *Mongo*
```

A second inspection using `Get-CimInstance Win32_Service` confirmed:

- Service name: MongoDB
- Display name: MongoDB Server (MongoDB)
- State: Running
- Startup mode: Automatic

### Outcome

MongoDB was already registered as a Windows service and configured for automatic startup.

No additional service installation or configuration changes were required.

### Next Verification
- Connect using Mongosh.
- Execute a database ping command.
- Confirm the response returns `ok: 1`.

### Conclusion

MongoDB is running as a Windows background service and is configured to start automatically when the computer boots.