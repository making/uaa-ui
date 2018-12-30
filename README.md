# uaa-ui
Web UI for Cloud Foundry UAA


```
./mvn clean package -DskipTests=true

java -jar target/uaa-ui-0.0.1-SNAPSHOT.jar --uaa.url=https://uaa.example.com --uaa.client-id=admin --uaa.client-secret=secret --uaa.skip-ssl-validation=true
```
