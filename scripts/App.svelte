<script>
	//@ts-check
	/** @import {Dépense} from "./types" */

	import { jsPDF } from "jspdf";
	import DépenseFieldset from "./DépenseFieldset.svelte";

	let nomEtPrénom = $state("");
	//let responsableOpérationnel = $state(""); // à faire un jour
	let fonctionLibellé = $state("");
	let mois = $state("");
	let année = $state("");

	let formatMontantEuros = new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR'
	})

	/** @type {Dépense[]} */
	let dépenses = $state([
		{
			dateDépense: new Date(),
			nomFournisseur: "",
			natureDépense: "",
			motifDépense: "",
			montantTVA: 0,
			montantTTC: 0,
			commentaires: "",
			justificatif: undefined,
		},
	])

	let totalTTC = $derived.by(() => {
		let total = 0

		for(const d of dépenses){
			total += d.montantTTC
		}

		return total
	})

	let totalTVA = $derived.by(() => {
		let total = 0

		for(const d of dépenses){
			total += d.montantTVA
		}

		return total
	})



	const maintenant = new Date();
	const leMoisDeMaintenant = maintenant.toLocaleDateString("fr-FR", {
		month: "long",
	});
	const lannéeDeMaintenant = maintenant.toLocaleDateString("fr-FR", {
		year: "numeric",
	});

	mois = leMoisDeMaintenant;
	année = lannéeDeMaintenant;

	/**
     * @param {Event} e
     */
	async function créerRécapNDF(e) {
		e.preventDefault();

		const doc = new jsPDF({
			orientation: "landscape",
			unit: "px",
			// apparement, nous n'avons pas besoin de cette option
//			hotfixes: ["px_scaling"],
		});
		doc.setFontSize(18);
		doc.text("L'Échappée Belle - Notes de frais", 20, 30);
		doc.setFontSize(13);
		const docWidth = doc.internal.pageSize.getWidth();
		const docHeight = doc.internal.pageSize.getHeight();

		// Premier tableau avec les informations sur la personne et la période
		doc.cell(
			20,
			60,
			250,
			18,
			"Nom & Prénom de la personne réalisant la NDF",
			1,
			"left",
		);
		doc.cell(20, 60, 300, 18, nomEtPrénom || " ", 1, "left");
		doc.cell(
			20,
			60,
			250,
			18,
			"Fonction de la personne réalisant la NDF",
			2,
			"left",
		);
		doc.cell(20, 60, 300, 18, fonctionLibellé || " ", 2, "left");
		doc.cell(20, 60, 250, 18, "Période de la NDF", 3, "left");
		doc.cell(20, 60, 300, 18, `${mois} ${année}`, 3, "left");

		// Deuxième tableau avec les dépenses
		let dépensesData = [];
		for (const dépense of dépenses) {
			const {
				dateDépense,
				nomFournisseur,
				natureDépense,
				motifDépense,
				montantTVA,
				montantTTC,
				commentaires,
			} = dépense;

			dépensesData.push({
				"Date": dateDépense.toLocaleDateString("fr-FR", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}),
				"Nom du fournisseur":
					doc.splitTextToSize(nomFournisseur, 70) || " ",
				Nature: doc.splitTextToSize(natureDépense, 100) || " ",
				Motif: doc.splitTextToSize(motifDépense, 100) || " ",
				"Montant\nTVA ": montantTVA.toFixed(2),
				"Montant\nTTC ": montantTTC.toFixed(2),
				"Commentaires ": doc.splitTextToSize(commentaires, 100) || " ",
			});
		}

		// hack pour ajouter la ligne de totaux à la fin du tableau
		dépensesData.push({
			"Date": "",
			"Nom du fournisseur": "",
			Nature: "",
			Motif: "Totaux",
			"Montant\nTVA ": `${totalTVA.toFixed(2)}€`,
			"Montant\nTTC ": `${totalTTC.toFixed(2)}€`,
			"Commentaires ": ""
		})

		/* On doit mettre exactement les mêmes libellés de headers que les clés
		 * des objets des données, sinon jspdf jette une erreur.
		 */
		const headers = [
			"Date",
			"Nom du fournisseur",
			"Nature",
			"Motif",
			"Montant\nTVA ",
			"Montant\nTTC ",
			"Commentaires ",
		];

		doc.table(20, 150, dépensesData, headers, {
			fontSize: 13,
			printHeaders: true,
			headerBackgroundColor: '#DDD'
		});

		for (const dépense of dépenses) {
			if (dépense.justificatif) {
				doc.addPage("a4", "landscape");

				const fichier = dépense.justificatif[0];

				if(!fichier)
					throw new TypeError('Fichier justificatif ne devrait pas être null')

				const fichierBase64P = new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.addEventListener(
						"load",
						() => {
							resolve(reader.result);
						},
						false,
					);
					reader.addEventListener("error", reject);
					reader.readAsDataURL(fichier);
				});

				const fichierBase64 = await fichierBase64P;
				const fichierDimensionsP = new Promise((resolve, reject) => {
					const img = new Image();
					const objectURL = URL.createObjectURL(fichier);

					img.onload = () => {
						resolve({ width: img.width, height: img.height });
						URL.revokeObjectURL(objectURL);
					};

					img.onerror = () => {
						reject(new Error("Impossible de charger l'image"));
						URL.revokeObjectURL(objectURL);
					};

					img.src = objectURL;
				});

				/**
				 * jspdf ne gère pas le resizing, on va faire un resize
				 * manuellement en partant du principe que :
				 *   - la largeur max d'une image est celle d'une page A4,
				 *     moins 20px de marge
				 *   - la hauteur max d'une image est celle d'une page A4,
				 *     moins 20 px de marge
				 */
				const fichierDimensions = await fichierDimensionsP;
				const { width: fichierWidth, height: fichierHeight } =
					fichierDimensions;
				let imgWidth = docWidth - 20;
				let imgHeight = docHeight - 20;
				let ratio;

				if (fichierWidth > fichierHeight) {
					ratio = imgWidth / fichierWidth;
					imgHeight = Math.floor(fichierHeight * ratio);
				} else {
					ratio = imgHeight / fichierHeight;
					imgWidth = Math.floor(fichierWidth * ratio);
				}

				doc.addImage(
					fichierBase64,
					"JPEG",
					10,
					10,
					imgWidth,
					imgHeight,
				);
			}
		}

		doc.save(`${nomEtPrénom} - NDF ${mois} ${année}.pdf`);
	}

	let derniereActionSupprimer = $state(false);

	/**
     * @param {{ preventDefault: () => void; }} e
     */
	async function ajouterDépense(e) {		
		derniereActionSupprimer = false;
		
		dépenses.push({
			dateDépense: new Date(),
			nomFournisseur: " ",
			natureDépense: " ",
			motifDépense: " ",
			montantTVA: 0,
			montantTTC: 0,
			commentaires: "\n\n",
			justificatif: undefined,
		});
	}

	/**
	 * 
	 * @param {Dépense} d
	 */
	function dupliquerDépense(d){
		derniereActionSupprimer = false;

		dépenses.push({
			dateDépense: d.dateDépense,
			nomFournisseur: d.nomFournisseur,
			natureDépense: d.natureDépense,
			motifDépense: d.motifDépense,
			montantTVA: d.montantTVA,
			montantTTC: d.montantTTC,
			commentaires: d.commentaires,
			justificatif: undefined,
		});
	}

	/**
	 * 
	 * @param {number} index
	 */
	function supprimerDépense(index){
		dépenses.splice(index, 1)

		derniereActionSupprimer = true;
	}


</script>

<h1>L'Échappée Belle - Notes de frais</h1>

<form onsubmit={créerRécapNDF}>
	<label>
		<span>Nom et prénom de la personne réalisant la NDF</span>
		<input
			bind:value={nomEtPrénom}
			type="text"
			autocomplete="on"
			name="nomEtPrénom"
		/>
	</label>
	<label>
		<span>Fonction de la personne réalisant la NDF</span>
		<input
			bind:value={fonctionLibellé}
			type="text"
			autocomplete="on"
			name="fonctionLibellé"
		/>
	</label>
	<label class="date">
		<span>Période de la NDF</span>
		<!-- Faire un composant de date -->
		<div>
			<select bind:value={mois}>
				<option>janvier</option>
				<option>février</option>
				<option>mars</option>
				<option>avril</option>
				<option>mai</option>
				<option>juin</option>
				<option>juillet</option>
				<option>août</option>
				<option>septembre</option>
				<option>octobre</option>
				<option>novembre</option>
				<option>décembre</option>
			</select>
			<input bind:value={année} type="number" min="2020" step="1" size="5" />
		</div>
	</label>
	<h2>Dépenses ({dépenses.length})</h2>

	{#each dépenses as dépense, index (dépense)}
		<DépenseFieldset
			bind:dépense={dépenses[index]}
			// ouvrir le dernier élément, sauf si la dernière action était de supprimer
			isOpen={derniereActionSupprimer ? false : (index === dépenses.length - 1)}
			dupliquerCetteDépense={() => dupliquerDépense(dépense)}
			supprimerCetteDépense={() => supprimerDépense(index)}
		/>
	{/each}

	<button type="button" onclick={ajouterDépense}>
		<svg
			width="20x"
			height="20px"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12.5 5.5C13.0523 5.5 13.5 5.94772 13.5 6.5V10.5H17.5C18.0523 10.5 18.5 10.9477 18.5 11.5V12.5C18.5 13.0523 18.0523 13.5 17.5 13.5H13.5V17.5C13.5 18.0523 13.0523 18.5 12.5 18.5H11.5C10.9477 18.5 10.5 18.0523 10.5 17.5V13.5H6.5C5.94772 13.5 5.5 13.0523 5.5 12.5V11.5C5.5 10.9477 5.94772 10.5 6.5 10.5H10.5V6.5C10.5 5.94772 10.9477 5.5 11.5 5.5H12.5Z"
				fill="#372323"
			/>
		</svg>
		Ajouter une dépense
	</button>

	<hr>
		<strong>Total TTC&nbsp;:</strong> {formatMontantEuros.format(totalTTC)}
		<br>
		<strong>Total TVA&nbsp;:</strong> {formatMontantEuros.format(totalTVA)}
	<hr>


	<button type="submit">Créer le récap de notes de frais 🚀</button>
</form>

<style lang="scss">
	@media (prefers-color-scheme: dark) {
		:global(body) {
			background-color: #372323;
		}
	}

	:global(main) {
		display: flex;
		text-align: left;
		padding: 2em;
		margin: 0 auto;
		color: #372323;

		@media (prefers-color-scheme: dark) {
			& {
				background-color: #372323;
				color: rgb(239, 231, 190);
			}
		}
	}

	:global(section) {
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 100%;

		input,
		select {
			border: 1px solid #372323;
			border-radius: 1px;
			padding: 0.2rem;
			margin: 0 0.2rem;
		}

		label {
			display: flex;
			flex-direction: column;
			margin-bottom: 0.7rem;

			&.date {
				flex-direction: row;
				flex-wrap:wrap;
				gap: .5rem;

				span {
					flex-grow: 1;
				}
			}

			span {
				font-weight: bold;
			}

			&:last-of-type {
				margin-bottom: 2rem;
			}
		}

		button {
			font-size: 1.2rem;
			padding: 0.7rem;
			margin: 0.5rem 0;
			color: #372323;
			border: 1px solid #372323;
			border-radius: 1px;
			background-color: rgb(255, 249, 215);

			&[type="submit"] {
				background-color: rgb(255, 215, 0);
				color: #372323;
				font-weight: bold;
				font-size: 1.5rem;
				padding: 1.5rem;
			}

			svg {
				margin-right: 0.3rem;
			}
		}
	}
</style>
