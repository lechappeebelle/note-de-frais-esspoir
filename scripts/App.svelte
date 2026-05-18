<script>
	import { jsPDF } from "jspdf";
	import DépenseFieldset from "./DépenseFieldset.svelte";

	/** @typedef Dépense
	 * @prop {string} jourDépense - le jour de la dépense
	 * @prop {string} moisDépense - le mois de la dépense
	 * @prop {string} annéeDépense - l'année de la dépense
	 * @prop {string} nomFournisseur - le nom du fournisseur
	 * @prop {string} natureDépense - la nature de la dépense
	 * @prop {string} motifDépense - le motif de la dépense
	 * @prop {string} montantHT - le montant HT
	 * @prop {string} montantTTC - le montant TTC
	 * @prop {string} commentaires - des commentaires à propos de la dépense
	 * @prop {FileList} justificatif - le justificatif de la dépense (plusieurs possibles ?)
	 */

	let nomEtPrénom = $state(" ");
	let responsableOpérationnel = $state(""); // à faire un jour
	let fonctionLibellé = $state(" ");
	let mois = $state("");
	let année = $state("");

	/** @type {Dépense[]} */
	let dépenses = $state([]);

	const maintenant = new Date();
	const leMoisDeMaintenant = maintenant.toLocaleDateString("fr-FR", {
		month: "long",
	});
	const lannéeDeMaintenant = maintenant.toLocaleDateString("fr-FR", {
		year: "numeric",
	});

	mois = leMoisDeMaintenant;
	année = lannéeDeMaintenant;

	dépenses.push({
		jourDépense: " ",
		moisDépense: leMoisDeMaintenant,
		annéeDépense: lannéeDeMaintenant,
		nomFournisseur: " ",
		natureDépense: " ",
		motifDépense: " ",
		montantHT: "00.00",
		montantTTC: "00.00",
		commentaires: " ",
		justificatifs: [],
	});

	async function créerRécapNDF(e) {
		e.preventDefault();

		const doc = new jsPDF({ orientation: "landscape" });
		doc.setFontSize(18);
		doc.text("L'Échappée Belle - Notes de frais", 10, 20);
		doc.setFontSize(12);

		// Premier tableau avec les informations sur la personne et la période
		doc.cell(
			10,
			30,
			110,
			10,
			"Nom & Prénom de la personne réalisant la NDF",
			1,
			"left",
		);
		doc.cell(10, 30, 150, 10, nomEtPrénom, 1, "left");
		doc.cell(
			10,
			30,
			110,
			10,
			"Fonction de la personne réalisant la NDF",
			2,
			"left",
		);
		doc.cell(10, 30, 150, 10, fonctionLibellé, 2, "left");
		doc.cell(10, 30, 110, 10, "Période de la NDF", 3, "left");
		doc.cell(10, 30, 150, 10, `${mois} ${année}`, 3, "left");

		// Deuxième tableau avec les dépenses
		let dépensesData = [];
		for (const dépense of dépenses) {
			const {
				moisDépense,
				annéeDépense,
				nomFournisseur,
				natureDépense,
				motifDépense,
				montantHT,
				montantTTC,
				commentaires,
			} = dépense;

			dépensesData.push({
				Date: `${moisDépense} ${annéeDépense}`,
				"Nom du fournisseur": nomFournisseur,
				Nature: natureDépense,
				Motif: motifDépense,
				"Montant HT": montantHT,
				"Montant TTC": montantTTC,
				Commentaires: commentaires,
			});
		}

		/* On doit mettre exactement les mêmes libellés de headers que les clés
		 * des objets des données, sinon jspdf jette une erreur.
		 */
		const headers = [
			"Date",
			"Nom du fournisseur",
			"Nature",
			"Motif",
			"Montant HT",
			"Montant TTC",
			"Commentaires",
		];

		doc.table(10, 70, dépensesData, headers, {
			autoSize: true,
			fontSize: 12,
		});

		for (const dépense of dépenses) {
			if (dépense.justificatif) {
				doc.addPage({ orientation: "landscape" });

				const fichier = dépense.justificatif.item(0);

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

				let fichierBase64 = await fichierBase64P;
				doc.addImage(fichierBase64, "JPEG", 5, 5);
			}
		}

		doc.save(`${nomEtPrénom} - NDF ${mois} ${année}.pdf`);
	}

	async function ajouterDépense(e) {
		e.preventDefault();

		dépenses.push({
			jourDépense: " ",
			moisDépense: leMoisDeMaintenant,
			annéeDépense: lannéeDeMaintenant,
			nomFournisseur: " ",
			natureDépense: " ",
			motifDépense: " ",
			montantHT: "00.00",
			montantTTC: "00.00",
			commentaires: " ",
			justificatifs: [],
		});
	}
</script>

<h1>L'Échappée Belle - Notes de frais</h1>

<form on:submit={créerRécapNDF}>
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
	<label>
		<span>Période de la NDF</span>
		<!-- Faire un composant de date -->
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
		<input bind:value={année} type="number" min="2020" step="1" />
	</label>
	<h2>Dépenses ({dépenses.length})</h2>
	{#each dépenses as dépense, index}
		<DépenseFieldset
			{dépense}
			{index}
			isOpen={index == dépenses.length - 1}
		/>
	{/each}
	<button on:click={ajouterDépense}>Ajouter une dépense ➕</button>

	<button type="submit">Créer le récap de notes de frais 🚀</button>
</form>

<style lang="scss">
	:global(main) {
		display: flex;

		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;

		@media (min-width: 640px) {
			max-width: 80rem;
		}
	}

	form {
		display: flex;
		flex-direction: column;

		label {
			display: flex;
			flex-direction: column;

			margin-bottom: 0.7rem;

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
			border: 1px solid #111;
			border-radius: 1px;

			&[type="submit"] {
				background-color: rgb(2, 84, 2);
				color: #fff;
				font-weight: bold;
			}
		}
	}
</style>
