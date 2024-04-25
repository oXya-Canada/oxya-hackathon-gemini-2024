# Assurez-vous d'être sur la branche principale (main)
git checkout main

# Récupérez les dernières modifications
git pull origin main

# Parcours de toutes les branches sauf la branche principale
foreach ($remoteBranch in (git branch -r | Where-Object { $_ -notlike '*origin/main' })) {
    # Supprimez les espaces dans le nom de la branche
    $cleanBranchName = $remoteBranch -replace '\s', ''
    $branchName = $cleanBranchName -replace 'origin/', ''
    Write-Output "Merging $branchName"
    Write-Output "cleanBranchName $cleanBranchName"
    # Créez une branche locale à partir de la branche distante
    git checkout -q $branchName

    # Appliquez les modifications de la branche principale
    git merge main -X theirs origin/main

    # Poussez les modifications vers la branche distante
    git push origin $branchName

    # Revenez à la branche principale pour le prochain cycle de fusion
    git checkout main
}

