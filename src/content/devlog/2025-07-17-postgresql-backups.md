---
id: 5
title: "PostgreSQL Backups"
date: 2025-07-17
category: feature
tags: ["PostgreSQL","CronJob","Bash Script"]
---
So since I incorporated an admin panel into my website with the ability to add/remove/update projects and dev logs, I became concerned of data corruption and malicious attacks. After fighting linux I finally got the correct version of Postgres tools install to run a pg_dump to get table backups. Set it up in a bash script to run a backup, date stamp the backup, and delete any backups older than 7 days. Then configured the Cron jobs on my Ubuntu box to run this script every night so if something gets compromised or messed up I at least have some backups to fall back on. Now if the server itself dies that's a whole other problem... 😊
