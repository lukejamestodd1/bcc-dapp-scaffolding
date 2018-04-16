rsync -r src/ frontend_files/
rsync -r build/contracts/ frontend_files/
git add .
git commit -m "adding frontend files"
git push
