<script>
	import { fillOdtTemplate } from "ods-xlsx";

	/** @type {HTMLInputElement} */
	let templateInput;

	/** @type {FileList | undefined} */
	let templateFiles;
	$: template = templateFiles && templateFiles[0];

	let nomEtPrénom;
	let responsableOpérationnel = ""; // à faire un jour
	let fonctionLibellé;
	let mois;
	let année;
	let nombreJoursFacturés;
	let réalisations;

	/** @type {FileList | undefined} */
	let réalisationFiles;
	$: réalisationFile = réalisationFiles && réalisationFiles[0];

	let réalisationsString;
	$: réalisationFile &&
		réalisationFile.text().then((jsonString) => {
			réalisationsString = jsonString;
		});

	$: réalisations =
		typeof réalisationsString === "string" &&
		JSON.parse(réalisationsString);

	const maintenant = new Date();

	mois = maintenant.toLocaleDateString("fr-FR", { month: "long" });
	année = maintenant.toLocaleDateString("fr-FR", { year: "numeric" });

	const documentTypeURL = "./data/lbc-service-fait.odt";

	// pré-charger le bon template
	fetch(documentTypeURL)
		.then((r) => r.blob())
		.then((blob) => {
			//console.log('blob', blob)
			const file = new File([blob], "lbc-service-fait.odt");
			let container = new DataTransfer();
			container.items.add(file);
			templateInput.files = container.files;
			templateFiles = templateInput.files;
		});

	async function créerServiceFait(e) {
		e.preventDefault();

		const data = {
			nomEtPrénom,
			responsableOpérationnel, // à faire un jour
			fonctionLibellé,
			mois,
			année,
			nombreJoursFacturés,
			réalisations: réalisations || {
				produit: [],
				déploiement: [],
				autre: [],
			},
		};

		const templateAB = await template.arrayBuffer();

		const serviceFaitOdtArrayBuffer = await fillOdtTemplate(
			templateAB,
			data,
		);

		télécharger(
			new Blob([serviceFaitOdtArrayBuffer], {
				type: "application/vnd.oasis.opendocument.text",
			}),
			`service-fait-${mois}-${année}.odt`,
		);
	}

	async function télécharger(blob, nomFichier) {
		const link = document.createElement("a");
		link.download = nomFichier;
		link.href = URL.createObjectURL(blob);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<h1>L'Échappée Belle - Notes de frais</h1>

<form on:submit={créerServiceFait}>
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
	<fieldset>
		<legend>Dépenses</legend>
		TODO : Tableau ou liste de card avec les infos pour chaque dépense.
	</fieldset>

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
			width: 10rem;
			padding: 0.7rem;
		}
	}
</style>
