# One place for release names, collections and DOIs. Adding a release is a
# config edit, not a code change (see docs/DATA_RELEASES.md).
# QR2 is no longer searchable: IRSA stopped returning QR2 in searches when
# DR1 was released (DR1 reprocesses the QR2 data), so this file serves DR1
# and QR3 only.
# The "deep" collections are left out until their DOIs are confirmed.
RELEASES = [
    {
        "id": "dr1",
        "label": "Data Release 1",
        "collections": ["spherex_dr1"],
        "doi": "10.26131/IRSA678",
        "enabled": True,
    },
    {
        "id": "qr3",
        "label": "Quick Release 3",
        "collections": ["spherex_qr3"],
        "doi": "10.26131/IRSA662",
        "enabled": True,
    },
    {
        "id": "qr2",
        "label": "Quick Release 2",
        "collections": ["spherex_qr2"],
        "doi": "10.26131/IRSA652",
        "enabled": False,
    },
]
