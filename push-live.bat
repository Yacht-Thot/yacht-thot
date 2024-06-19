@echo off
git add .
git commit -a -m "WinLap commit"
git push
ssh -t root@arcturia.co "sudo nohup bash update-yt.sh"
exit