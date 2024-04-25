#!/bin/bash

# Assurez-vous d'être sur la branche principale (main)
git checkout main

# Récupérez les dernières modifications
git pull origin main

# Parcours de toutes les branches sauf la branche principale
for remoteBranch in $(git branch -r | grep -v "origin/main"); do
    # Supprimez les espaces dans le nom de la branche
    cleanBranchName=$(echo "$remoteBranch" | sed 's/origin\///' | sed 's/\s//g')
    branchName=$(echo "$cleanBranchName" | sed 's/origin\///')

    echo "Merging $branchName"
    echo "cleanBranchName $cleanBranchName"

    # Créez une branche locale à partir de la branche distante
    git checkout -q $branchName

    # Appliquez les modifications de la branche principale
    git merge -X theirs origin/main

    # Poussez les modifications vers la branche distante
    git push origin $branchName

    # Revenez à la branche principale pour le prochain cycle de fusion
    git checkout main
done
